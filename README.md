# ICC Hellas Institute of Management & Marketing

Responsive institutional website for the ICC Hellas Institute of Management & Marketing.
The project uses HTML, CSS, vanilla JavaScript and Vite.

## Requirements

- Node.js 20.19 or newer
- npm 10 or newer

## Installation

Open a terminal in the project directory and install the dependencies:

```bash
npm install
```

## Local Development

Start the Vite development server:

```bash
npm run dev
```

On Windows systems where PowerShell blocks `npm.ps1`, use the equivalent command:

```powershell
npm.cmd run dev
```

Vite will display the local address, normally:

```text
http://localhost:5173
```

## Production Build

Create the production build:

```bash
npm run build
```

The optimized website is generated in:

```text
dist/
```

To test the production build locally:

```bash
npm run preview
```

## Project Structure

```text
.
|-- index.html
|-- styles.css
|-- script.js
|-- article.js
|-- libraryArticles.js
|-- library/
|   |-- new-reality-management/
|   |-- ai-marketing-competitiveness/
|   `-- business-experience-policy-note/
|-- public/
|   `-- images/
|       |-- imm-logo.png
|       |-- committee/
|       `-- library/
|-- package.json
|-- vite.config.js
|-- vercel.json
`-- netlify.toml
```

All files required by the deployed website are stored inside the repository. Public images
use root-relative URLs such as `/images/imm-logo.png`.

## Deployment

### Upload to GitHub

1. Create a new empty repository on GitHub.
2. From the project directory run:

```bash
git init
git add .
git commit -m "Prepare ICC IMM website for deployment"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

Replace `YOUR-USERNAME` and `YOUR-REPOSITORY` with the actual GitHub values.

### Deploy with Vercel

1. Sign in to [Vercel](https://vercel.com/) and select **Add New Project**.
2. Import the GitHub repository.
3. Vercel should automatically detect Vite.
4. Confirm these settings:

```text
Build command: npm run build
Output directory: dist
Install command: npm install
```

5. Select **Deploy**.

The included `vercel.json` already defines the Vite framework, build command and output
directory.

### Deploy with Netlify

1. Sign in to [Netlify](https://www.netlify.com/) and select **Add new site**.
2. Import the GitHub repository.
3. Use:

```text
Build command: npm run build
Publish directory: dist
```

The included `netlify.toml` supplies these settings automatically.

### Custom Domain or Subdomain

For Vercel, open the deployed project and go to **Settings > Domains**. Add the desired
domain or subdomain, such as `imm.iccwbo.gr`, and create the DNS record shown by Vercel
at the domain provider.

For Netlify, open **Domain management > Add a domain**, enter the domain or subdomain
and apply the provided DNS records.

DNS propagation can take from a few minutes up to 48 hours. HTTPS certificates are
issued automatically after the DNS configuration is verified.

## External Presentations

The Gamma presentation links open in a new browser tab and use
`rel="noopener noreferrer"` for security.

## Digital Library Articles

The current article routes are:

```text
/library/new-reality-management/
/library/ai-marketing-competitiveness/
/library/business-experience-policy-note/
```

Article metadata, content, images, references and suggested-next-article relationships are
stored centrally in `libraryArticles.js`. The home-page cards and article pages use the same
data source.

To add a new article:

1. Add its image to `public/images/library/`.
2. Add a new object to `libraryArticles.js`.
3. Create a route folder under `library/ARTICLE-SLUG/` using an existing article `index.html`
   as the small page entry point.
4. Add that HTML file to `build.rollupOptions.input` in `vite.config.js`.
5. Run `npm run build` and verify the generated route inside `dist/library/`.
