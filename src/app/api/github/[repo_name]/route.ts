import { NextRequest, NextResponse } from "next/server";
import { getToken } from "@/utils/getToken";
import { GITHUB_API_URL } from "@/utils/constants";

export async function GET(
	req: NextRequest,
	context: { params: Promise<{ repo_name: string }> }
) {
	const token = getToken();
	if (token instanceof Response) return token;

	const { repo_name: repositoryName } = await context.params;

	if (!repositoryName) {
		return NextResponse.json(
			{ error: "Repository name is missing" },
			{ status: 400 }
		);
	}

	try {
		const repoInformation = await fetch(
			`${GITHUB_API_URL}/repos/Yash912002/${repositoryName}`,
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
