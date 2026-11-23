
// import React from "react";
// import { Link } from "react-router-dom";

// import SplitFeatureCard from "./learn-more/SplitFeatureCard";
// import ArticleBody from "./publication/ArticleBody";
// import ArticleNavigation from "./publication/ArticleNavigation";

// export default function PublicationDetailLayout({
//   publication,
//   previousArticle = null,
//   nextArticle = null,
//   backLink = "/publication/articles",
//   backLabel = "Back to all publications",
// }) {
//   if (!publication) return null;

//   return (
//     <main className="min-h-screen bg-white font-sans">
//       <SplitFeatureCard
//         eyebrow={publication.category || ""}
//         title={
//           publication.detailHeroTitle ||
//           publication.title
//         }
//         description={publication.detailHeroDescription || ""}
//         image={
//           publication.detailHeroImage ||
//           publication.image
//         }
//         imageAlt={
//           publication.detailHeroImageAlt ||
//           publication.imageAlt ||
//           publication.title
//         }
//         imagePosition="right"
//         background="dark"
//       />

//       {/* MAIN TITLE */}
//       <section className="mx-auto w-full max-w-[1100px] px-5 pb-6 pt-9 sm:px-8 sm:pb-8 sm:pt-12">
//         <header className="mx-auto max-w-[850px] text-center">
//           <h1 className="text-xl font-bold leading-[1.4] text-[#263247] sm:text-2xl lg:text-[28px]">
//             {publication.detailTitle || publication.title}
//           </h1>

//           {publication.detailSubtitle && (
//             <p className="mx-auto mt-4 max-w-[850px] text-[12px] leading-[1.8] text-[#414B59] sm:text-sm">
//               {publication.detailSubtitle}
//             </p>
//           )}
//         </header>
//       </section>

//       {/* ARTICLE CONTENT */}
//       <section className="bg-[#FCFCFD]">
//         <div className="mx-auto w-full max-w-[1100px] px-5 py-8 sm:px-8 sm:py-10">
//           <ArticleBody
//             introductionTitle={publication.introductionTitle}
//             introductionParagraphs={
//               publication.introductionParagraphs || []
//             }
//             contentBlocks={publication.contentBlocks || []}
//             closingTitle={publication.closingTitle}
//             closingParagraphs={
//               publication.closingParagraphs || []
//             }
//             closingBullets={publication.closingBullets || []}
//             author={publication.author}
//           />

//           {/* PREVIOUS / NEXT NAVIGATION */}
//           <ArticleNavigation
//             previousArticle={previousArticle}
//             nextArticle={nextArticle}
//           />

//           {/* BACK TO ARTICLES */}
//           <div className="mt-8 border-t border-gray-200 pt-6 text-center">
//             <Link
//               to={backLink}
//               className="text-sm font-medium text-[#315778] underline underline-offset-4 transition hover:text-[#E87565]"
//             >
//               {backLabel}
//             </Link>
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// }


// import React from "react";
// import { Link } from "react-router-dom";

// import SplitFeatureCard from "./learn-more/SplitFeatureCard";
// import ArticleBody from "./publication/ArticleBody";
// import ArticleNavigation from "./publication/ArticleNavigation";

// export default function PublicationDetailLayout({
//   publication,
//   previousArticle = null,
//   nextArticle = null,
//   backLink = "/industry-insight/articles",
//   backLabel = "Back to all publications",
//   basePath
// }) {
//   if (!publication) return null;

//   return (
//     <main className="min-h-screen bg-white font-sans">
//       <SplitFeatureCard
//         eyebrow={publication.category || ""}
//         title={
//           publication.detailHeroTitle ||
//           publication.title
//         }
//         description={publication.detailHeroDescription || ""}
//         image={
//           publication.detailHeroImage ||
//           publication.image
//         }
//         imageAlt={
//           publication.detailHeroImageAlt ||
//           publication.imageAlt ||
//           publication.title
//         }
//         imagePosition="right"
//         background="dark"
//       />

//       <section className="mx-auto w-full max-w-[1100px] px-5 pb-6 pt-9 sm:px-8 sm:pb-8 sm:pt-12">
//         <header className="mx-auto max-w-[850px] text-center">
//           <h1 className="text-xl font-bold leading-[1.4] text-[#263247] sm:text-2xl lg:text-[28px]">
//             {publication.detailTitle || publication.title}
//           </h1>

//           {publication.detailSubtitle && (
//             <p className="mx-auto mt-4 max-w-[850px] text-[12px] leading-[1.8] text-[#414B59] sm:text-sm">
//               {publication.detailSubtitle}
//             </p>
//           )}
//         </header>
//       </section>

//       <section className="bg-[#FCFCFD]">
//         <div className="mx-auto w-full max-w-[1100px] px-5 py-8 sm:px-8 sm:py-10">
//           <ArticleBody
//             introductionTitle={publication.introductionTitle}
//             introductionParagraphs={
//               publication.introductionParagraphs || []
//             }
//             contentBlocks={publication.contentBlocks || []}
//             closingTitle={publication.closingTitle}
//             closingParagraphs={
//               publication.closingParagraphs || []
//             }
//             closingBullets={publication.closingBullets || []}
//             author={publication.author}
//           />

//           <ArticleNavigation
//             previousArticle={previousArticle}
//             nextArticle={nextArticle}
//             basePath={basePath}
//           />

//           <div className="mt-8 border-t border-gray-200 pt-6 text-center">
//             <Link
//               to={backLink}
//               className="text-sm font-medium text-[#315778] underline underline-offset-4 transition hover:text-[#E87565]"
//             >
//               {backLabel}
//             </Link>
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// }



import React from "react";
import { Link } from "react-router-dom";
import { Download, FileDown } from "lucide-react";

import SplitFeatureCard from "./learn-more/SplitFeatureCard";
import ArticleBody from "./publication/ArticleBody";
import ArticleNavigation from "./publication/ArticleNavigation";

export default function PublicationDetailLayout({
  publication,
  previousArticle = null,
  nextArticle = null,
  backLink = "/industry-insight/articles",
  backLabel = "Back to all publications",
  basePath,
  showDownloadButtons = true,
}) {
  if (!publication) return null;

  const pdfUrl =
    typeof publication.pdfUrl === "string"
      ? publication.pdfUrl
      : typeof publication.pdf === "string"
        ? publication.pdf
        : publication.pdf?.url || publication.downloadPdfUrl || "";

  return (


    
    <main className="min-h-screen bg-white font-sans">
      <style>
  {`
    @media print {
      @page {
        size: A4;
        margin: 15mm;
      }

      body * {
        visibility: hidden !important;
      }

      #article-print-content,
      #article-print-content * {
        visibility: visible !important;
      }

      #article-print-content {
        display: block !important;
        position: absolute !important;
        left: 0 !important;
        top: 0 !important;
        width: 100% !important;
        max-width: 100% !important;
        background: white !important;
        color: #172337 !important;
      }

      #article-print-content img {
        max-width: 100% !important;
        height: auto;
        break-inside: avoid;
      }

      #article-print-content h1,
      #article-print-content h2,
      #article-print-content h3 {
        break-after: avoid;
      }

      #article-print-content p {
        orphans: 3;
        widows: 3;
      }

      .no-print {
        display: none !important;
      }
    }
  `}
</style>
     

      {/* Article Download Actions */}
      {showDownloadButtons && (
        <section className="border-b border-gray-200 bg-[#F8FAFC] px-5 py-5 sm:px-8 lg:px-12">
          <div className="mx-auto flex max-w-[1100px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-semibold text-[#263247]">
                Save this article
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                Download a copy for future reference.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {pdfUrl ? (
                <a
                  href={pdfUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#20466C] px-5 py-3 text-xs font-semibold text-white transition hover:bg-[#173653] sm:text-sm"
                >
                  <FileDown size={17} />
                  Download PDF
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  title="PDF not available"
                  className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-sm border border-gray-300 bg-gray-100 px-5 py-3 text-xs font-semibold text-gray-400 sm:text-sm"
                >
                  <FileDown size={17} />
                  Download PDF
                </button>
              )}

              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center justify-center gap-2 rounded-sm border border-[#E87565] bg-white px-5 py-3 text-xs font-semibold text-[#E87565] transition hover:bg-[#E87565] hover:text-white sm:text-sm"
              >
                <Download size={17} />
                Download Article
              </button>
            </div>
          </div>
        </section>
      )}
<div id="article-print-content" className="article-print-content">
   <SplitFeatureCard
        eyebrow={publication.category || ""}
        title={
          publication.detailHeroTitle ||
          publication.title
        }
        description={publication.detailHeroDescription || ""}
        image={
          publication.detailHeroImage ||
          publication.image
        }
        imageAlt={
          publication.detailHeroImageAlt ||
          publication.imageAlt ||
          publication.title
        }
        imagePosition="right"
        background="dark"
      />

      <section className="mx-auto w-full max-w-[1100px] px-5 pb-6 pt-9 sm:px-8 sm:pb-8 sm:pt-12">
        <header className="mx-auto max-w-[850px] text-center">
          <h1 className="text-xl font-bold leading-[1.4] text-[#263247] sm:text-2xl lg:text-[28px]">
            {publication.detailTitle || publication.title}
          </h1>

          {publication.detailSubtitle && (
            <p className="mx-auto mt-4 max-w-[850px] text-[12px] leading-[1.8] text-[#414B59] sm:text-sm">
              {publication.detailSubtitle}
            </p>
          )}
        </header>
      </section>

      <section className="bg-[#FCFCFD]">
        <div className="mx-auto w-full max-w-[1100px] px-5 py-8 sm:px-8 sm:py-10">
          <ArticleBody
            introductionTitle={publication.introductionTitle}
            introductionParagraphs={
              publication.introductionParagraphs || []
            }
            contentBlocks={publication.contentBlocks || []}
            closingTitle={publication.closingTitle}
            closingParagraphs={
              publication.closingParagraphs || []
            }
            closingBullets={publication.closingBullets || []}
            author={publication.author}
          />

        </div>
          <ArticleNavigation
            previousArticle={previousArticle}
            nextArticle={nextArticle}
            basePath={basePath}
          />

          <div className="mt-8 border-t border-gray-200 pt-6 text-center">
            <Link
              to={backLink}
              className="text-sm font-medium text-[#315778] underline underline-offset-4 transition hover:text-[#E87565]"
            >
              {backLabel}
            </Link>
          </div>
      </section>
      </div>
    </main>
  );
}
