import { NextRequest, NextResponse } from "next/server";
import { getToken } from "@/utils/getToken";
import { GITHUB_API_URL } from "@/utils/constants";

export async function POST(
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

	const { title, body } = await req.json();

	if (!title || !body) {
		return NextResponse.json(
			{
				error: "Both title and body are required to create an issue",
			},
			{ status: 400 }
		);
	}

	try {
		const createIssue = await fetch(
			`${GITHUB_API_URL}/repos/Yash912002/${repositoryName}/issues`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					Accept: "application/vnd.github+json",
				},
				body: JSON.stringify({
					title,
					body,
				}),
			}
		);

		if (!createIssue.ok) {
			return NextResponse.json(
				{
					error: "Failed to create issue",
				},
				{ status: createIssue.status }
			);
		}

		const issue_data = await createIssue.json();

		const response = {
			issue_url: issue_data.html_url,
		};

		return NextResponse.json(response);
	} catch (error) {
		console.error("Error creating GitHub issue:", error);
		return NextResponse.json(
			{
				error: "Internal server error while creating issue.",
			},
			{ status: 500 }
		);
	}
}
