import { NextResponse } from "next/server";
import Item from "@/models/Item"; // Import IItem and Item model
import dbConnect from "@/lib/mongodb"; // your db connection file

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

    // Fetch all items
    let itemsList;
    if (search) {
      itemsList = searchItem(search);
    } else if (itemid) {
      itemsList = await Item.find({ id: itemid });
    } else {
      itemsList = await Item.find();
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
    const body = await request.json();

    // Map suggestion fields (from your front-end) to Item model fields
    const { name, category, description } = body;

    // Convert 'name' to a URL-friendly slug for the 'id' field
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // Remove non-alphanumeric chars (except space and dash)
      .trim()
      .replace(/\s+/g, "-"); // Replace spaces with dashes

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
