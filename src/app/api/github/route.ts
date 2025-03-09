import { NextResponse } from "next/server";

type RepoType = {
	name: string;
	description: string | null;
	html_url: string;
};

export async function GET() {
	// Get the token
	const token = process.env.GITHUB_TOKEN;

	if (!token) {
		return NextResponse.json(
			{
				error: "Failed to fetch the token",
			},
			{ status: 404 }
		);
	}

	try {
		// Fetch user profile
		const userProfile = await fetch("https://api.github.com/user", {
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: "application/vnd.github+json",
			},
		});

		if (!userProfile.ok) {
			return NextResponse.json(
				{ error: "Failed to fetch user data" },
				{ status: userProfile.status }
			);
		}

		const userData = await userProfile.json();

		// Fetch all the repositories
		const repositories = await fetch("https://api.github.com/user/repos", {
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: "application/vnd.github+json",
			},
		});

		if (!repositories.ok) {
			return NextResponse.json(
				{ error: "Failed to fetch repositories" },
				{ status: repositories.status }
			);
		}

		const reposData = await repositories.json();

		// Create a response object
		const response = {
			username: userData.login,
			followers: userData.followers,
			following: userData.following,
			repositories: reposData.map((repo: RepoType) => ({
				name: repo.name,
				description: repo.description,
				url: repo.html_url,
			})),
		};

		return NextResponse.json(response);
	} catch (error) {
		console.error("Error fetching GitHub data:", error);
		return NextResponse.json(
			{
				error: "An error occurred while fetching data from GitHub.",
			},
			{ status: 500 }
		);
	}
}
