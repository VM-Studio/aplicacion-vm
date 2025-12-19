import { NextResponse } from "next/server";
import { getProjects, createProject, updateProject, deleteProject } from "@/app/actions/projects";

export async function GET() {
  try {
    const projects = await getProjects();
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching projects" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const project = await createProject(body);
    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json({ error: "Error creating project" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    const project = await updateProject(id, updates);
    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json({ error: "Error updating project" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }
    await deleteProject(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Error deleting project" }, { status: 500 });
  }
}
