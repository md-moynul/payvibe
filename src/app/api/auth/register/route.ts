import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!name || !email || password.length < 6) {
      return NextResponse.json(
        {
          error:
            "Name, valid email, and password (minimum 6 characters) are required.",
        },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    const usersCollection = db.collection("users");

    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const role = "customer";

    const result = await usersCollection.insertOne({
      name,
      email,
      passwordHash,
      role,
      status: "Active",
      isActive: true,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        message: "Account created successfully.",
        user: {
          id: result.insertedId.toString(),
          name,
          email,
          role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Internal server error while registering user." },
      { status: 500 }
    );
  }
}