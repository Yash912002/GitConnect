import { NextRequest, NextResponse } from "next/server";

export async function GET(
	req: NextRequest,
	context: { params: Promise<{ repo_name: string }> }
) {
	const token = process.env.GITHUB_TOKEN;

	if (!token) {
		return NextResponse.json(
			{
				error: "Failed to fetch the token",
			},
			{ status: 404 }
		);
	}

	const { repo_name: repositoryName } = await context.params;

	if (!repositoryName) {
		return NextResponse.json(
			{ error: "Repository name is missing" },
			{ status: 400 }
		);
	}

	try {
		const repoInformation = await fetch(
			`https://api.github.com/repos/Yash912002/${repositoryName}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
					Accept: "application/vnd.github+json",
				},
			}
		);

		if (!repoInformation.ok) {
			return NextResponse.json(
				{
					error: "Repository not found",
				},
				{ status: repoInformation.status }
			);
		}

		const repository = await repoInformation.json();

		const formattedResponse = {
			name: repository.name,
			description: repository.description,
			stars: repository.stargazers_count,
			forks: repository.forks_count,
			open_issues: repository.open_issues_count,
			url: repository.html_url,
		};

		return NextResponse.json(formattedResponse);
	} catch (error) {
		console.error("Error fetching repository data:", error);
		return NextResponse.json(
			{
				error: "Internal server error while fetching repository data.",
			},
			{ status: 500 }
		);
	}
}
