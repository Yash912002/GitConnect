import { NextResponse } from "next/server";

export function getToken() {
	const token = process.env.GITHUB_TOKEN;

	if (!token) {
		return NextResponse.json(
			{
				error: "Failed to fetch the token",
			},
			{ status: 404 }
		);
	}
}
