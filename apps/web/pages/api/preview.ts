
export default async function handler(req, res) {
    if (req.method === "GET") {
      const query = req.query

      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
          <g>
            <title>Figma changes</title>
            <rect stroke="#ffffff" id="svg_1" height="238" width="253.99999" y="181" x="100" fill="${query.fromColor}"/>
            <rect stroke="#ffffff" id="svg_5" height="238" width="253.99999" y="181" x="450" fill="${query.toColor}"/>
            <path transform="rotate(90.7381 401.053 299.973)" id="svg_6" d="m384.55285,299.912l16.50001,-25.4388l16.50001,25.4388l-8.25001,0l0,25.5612l-16.50001,0l0,-25.5612l-8.25001,0z" stroke="#ffffff" fill="#000000"/>
          </g>
        </svg>
      `
  
      res.setHeader('Content-Type', 'image/svg+xml')
  
      const imageBuffer = Buffer.from(svg)
  
      return res.send(imageBuffer)
    }
}