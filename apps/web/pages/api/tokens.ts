import { Octokit } from "@octokit/rest";
import path from "path";
import _ from "lodash";

const PACKAGE_SRC = "packages/design-tokens";

const octokit = new Octokit({
  auth: process.env.GIT_ACCESS,
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const body = JSON.parse(req.body);

      // get file from repo
      const file = await octokit.rest.repos.getContent({
        owner: "ljbc1994",
        repo: "design-system",
        path: `${PACKAGE_SRC}/${body.filePath}`,
      });

      const contents = JSON.parse(
        Buffer.from((file.data as any).content, "base64").toString("utf8")
      );
      const result = _.update(
        contents,
        body.path.concat(["value"]).join("."),
        () => body.value
      );

      // dispatch updated file to workflow...
      await octokit.rest.repos.createDispatchEvent({
        owner: "ljbc1994",
        repo: "design-system",
        event_type: "update-tokens",
        client_payload: {
          // File data
          file: path.basename(body.filePath),
          dir: `${PACKAGE_SRC}/${path.dirname(body.filePath)}`,
          tokens: JSON.stringify(result),

          // PR data
          commit_title: `Design token (${body.name}) updated to ${body.value}`,
          commit_message: `Token updated for ${body.name} in ${body.filePath}`,
          commit_body: `# What's changed?

Design token (${
            body.name
          }) has been updated via Figma by @ljbc1994 and needs to be reviewed.

## Preview

<img src="https://${
            process.env.WEB_URL
          }/api/preview?fromColor=${encodeURIComponent(
            body.original.value
          )}&toColor=${encodeURIComponent(
            body.value
          )}" width="800" height="600" />
          `,
        },
      });
    } catch (ex) {
      console.log(ex);
    }

    res.status(200).json({ name: "John Doe" });
  }
}
