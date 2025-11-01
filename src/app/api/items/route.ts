import { NextResponse } from "next/server";
import Item, { IItem } from "@/models/Item"; // Import IItem and Item model
import Review, { IReview } from "@/models/Review";
import dbConnect from "@/lib/mongodb"; // your db connection file
import cloudinary, { uploadToCloudinary } from "@/lib/cloudinary";
import aiCheckItem from "@/lib/aicheck";

// Ensure the database connection is established at the module level (Next.js Edge) or in the handler.
// We'll keep it in the handler for robustness.

async function searchItem(search: string | null) {
  try {
    await dbConnect();

    // Fetch all items
    let itemsList;

    if (search) {
      // Use case-insensitive regex search on 'name' or 'description'
      itemsList = await Item.find({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      });
    } else {
      // If no search query, fetch all items
      itemsList = await Item.find();
    }

    return itemsList;
  } catch (error) {
    console.error("Error fetching items list:", error);
    return [];
  }
}

// ====================================================================
// GET /api/items: Fetch all items
// ====================================================================
export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const search: string | null = searchParams.get("search");
    const itemid: string | null = searchParams.get("id");
    const justItem: string | null = searchParams.get("justItem");

    // Fetch all items
    let itemsList;
    if (search) {
      itemsList = await searchItem(search);
    } else if (itemid) {
      // const item:ItemType1  = await Item.findOne({ id: itemid }).lean();
      // const item = await Item.findOne<ItemType1>({ id: itemid }).lean();
      const item = await Item.findOne({ id: itemid }).lean<IItem>();

      if (!item) {
        return new Response(JSON.stringify({ error: "Item not found" }), {
          status: 404,
        });
      }
      // 2) Make sure we have an ObjectId to match against Review.itemId
      // const itemObjectId =item._id instanceof mongoose.Types.ObjectId
      //     ? item._id
      //     : new mongoose.Types.ObjectId(item._id);

      const itemObjectId = item._id;

      const reviewStats = await Review.aggregate([
        { $match: { itemId: itemObjectId } },
        {
          $facet: {
            // 1️⃣ Summary info (average + count)
            summary: [
              {
                $group: {
                  _id: "$itemId",
                  averageRating: { $avg: "$rating" },
                  totalReviews: { $sum: 1 },
                },
              },
            ],
            // 2️⃣ Breakdown info (count of each rating)
            breakdown: [
              {
                $group: {
                  _id: "$rating",
                  count: { $sum: 1 },
                },
              },
              { $sort: { _id: -1 } }, // highest rating first (5 → 1)
            ],
          },
        },
        {
          $project: {
            summary: { $arrayElemAt: ["$summary", 0] },
            breakdown: 1,
          },
        },
      ]);

      // const item = await Item.findOne({ id: itemid }).lean();

      const summary = reviewStats[0]?.summary || {
        averageRating: 0,
        totalReviews: 0,
      };
      const breakdown = reviewStats[0]?.breakdown || [];

      // Fill in missing ratings (0–5) with zero counts
      const ratingBreakdown = Array.from({ length: 6 }, (_, i) => {
        const found = breakdown.find((b: IReview) => b._id === i);
        return { rating: i, count: found ? found.count : 0 };
      }).reverse(); // optional → order 5 → 0

      if (!item) throw new Error("Item not found");

      if (justItem == "true") {
        itemsList = {
          id: item.id,
          name: item.name,
          category: item.category,
          description: item.description,
          imageUrl: item.image,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          averageRating: Number(summary.averageRating?.toFixed(1)) || 0,
          reviewCount: summary.totalReviews || 0,
        };
      } else
        itemsList = {
          id: item.id,
          name: item.name,
          category: item.category,
          description: item.description,
          imageUrl: item.image,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          overallRating: Number(summary.averageRating?.toFixed(1)) || 0,
          totalReviews: summary.totalReviews || 0,
          ratingBreakdown,
        };
      // console.log("itemsList", itemsList);
    } else {
      const reviewStats = await Review.aggregate([
        {
          $group: {
            _id: "$itemId", // group by itemId
            averageRating: { $avg: "$rating" },
            totalReviews: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            itemId: "$_id",
            averageRating: 1,
            totalReviews: 1,
          },
        },
      ]);
      const items = await Item.find().lean<IItem[]>();

      const statsMap = reviewStats.reduce((acc, stat) => {
        acc[stat.itemId.toString()] = stat;
        return acc;
      }, {});

      itemsList = items.map((item) => {
        const stat = statsMap[item._id.toString()] || {
          averageRating: 0,
          totalReviews: 0,
        };
        return {
          ...item,
          averageRating: stat.averageRating,
          totalReviews: stat.totalReviews,
        };
      });

      // console.log("itemsList", itemsList);
    }
    return NextResponse.json({ success: true, data: itemsList });
  } catch (error) {
    console.error("Error fetching items list:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch items list" },
      { status: 500 }
    );
  }
}

// ====================================================================
// POST /api/items: Create a new item (Suggestion handler)
// Note: We use the Item model fields: id, name, category, tags
// ====================================================================
export async function POST(request: Request) {
  try {
    await dbConnect();
    // const body = await request.json();

    // Map suggestion fields (from your front-end) to Item model fields
    // const { name, category, description, imageFile } = body;
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;
    const imageFile = formData.get("image") as Blob | null;
    let imageUrl: string = "";

    // Convert 'name' to a URL-friendly slug for the 'id' field
    // Ensure required fields are present
    if (!name || !category || !description) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields: name, category, or description.",
        },
        { status: 400 }
      );
    }
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // Remove non-alphanumeric chars (except space and dash)
      .trim()
      .replace(/\s+/g, "-"); // Replace spaces with dashes

    // check if the slug already exists
    const checkSlug = await Item.find({ id: slug });
    if (checkSlug.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Item with name '${name}' already exists.`,
        },
        { status: 409 } // 409 Conflict
      );
    }

    // check with ai if the item being uploaded is correct or not
    const isValidItem = await aiCheckItem(
      `name:${name}, description:${description}, category:${category}`
    );

    if (!isValidItem.isValid) {
      return NextResponse.json(
        {
          success: false,
          message: `The item '${name}' failed the AI validation check. because: ${isValidItem.reason}`,
        },
        { status: 400 }
      );
    }
    // const imageFile = body.get("image") as File | null;
    if (imageFile) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // ✅ Await upload properly
      const uploadResult: any = await uploadToCloudinary(buffer, "items");
      imageUrl = uploadResult.secure_url;
      console.log("✅ Uploaded to Cloudinary:", imageUrl);
    }

    // Check if an item with this slug already exists (avoid duplicates)
    const existingItem = await Item.findOne({ id: slug });
    if (existingItem) {
      return NextResponse.json(
        {
          success: false,
          message: `Item '${name}' already exists in the index.`,
        },
        { status: 409 } // 409 Conflict
      );
    }

    // Create the new item (The review metrics start at 0)
    const newItem = await Item.create({
      id: slug,
      name,
      category,
      image: imageUrl,
      description,
      // Tags could optionally be extracted from the description or name here
      tags: [category, ...name.toLowerCase().split(/\s+/).slice(0, 3)],
      reviewCount: 0,
      averageRating: 0,
    });

    return NextResponse.json(
      {
        success: true,
        data: newItem,
        message: `Item '${name}' suggested and added successfully.`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating item:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create item." },
      { status: 500 }
    );
  }
}

// NOTE: PUT and DELETE are commented out as they primarily apply to the Review document
// and an Item document is usually managed via an admin panel or aggregated logic.

// export async function PUT(...) {}
// export async function DELETE(...) {}
