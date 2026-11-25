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


import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FileDown,
  Loader2,
  MessageSquare,
  Mail,
} from "lucide-react";

import SplitFeatureCard from "./learn-more/SplitFeatureCard";
import ArticleBody from "./publication/ArticleBody";
import ArticleNavigation from "./publication/ArticleNavigation";
import SpecialArticleRegistrationModal from "./publication/SpecialArticleRegistrationModal";

import { submitArticleFeedback } from "../services/api";

export default function PublicationDetailLayout({
  publication,
  previousArticle = null,
  nextArticle = null,
  backLink = "/industry-insight/articles",
  backLabel = "Back to all publications",
  basePath,
  showDownloadButtons = true,

  // Show feedback only on Article Details Page
  showArticleFeedback = false,
  readerRegistered = false,

  // Article access
  accessGranted = true,
  totalWords = 0,
  hasMore = false,
  currentSegment = "full",

  // Read More
  onReadMore,
  loadingNextSegment = false,

  // Registration
  registrationOpen = false,
  onCloseRegistration,
  onRegisterReader,
  registrationLoading = false,

  // AIA contribution email
  contributionEmail = "aiateam@gmail.com",
}) {
  const [helpful, setHelpful] = useState(null);
  const [comment, setComment] = useState("");
  const [wantsToContribute, setWantsToContribute] = useState(null);

  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackError, setFeedbackError] = useState("");

  if (!publication) return null;

  const segmentNumber = Number(currentSegment);

  const showReaderAction =
    !accessGranted &&
    ((segmentNumber === 1 && totalWords > 500) ||
      (segmentNumber === 2 && totalWords > 1000));

  console.log("ARTICLE READ MORE DEBUG:", {
    totalWords,
    currentSegment,
    segmentNumber,
    accessGranted,
    showReaderAction,
    readerRegistered,
  });

  const canDownloadPdf = accessGranted;

  const handleDownloadPdf = () => {
    window.print();
  };

  // ==========================================
  // ARTICLE FEEDBACK
  // ==========================================

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();

    if (typeof helpful !== "boolean") {
      setFeedbackError("Please select Yes or No.");
      return;
    }

    try {
      setFeedbackLoading(true);
      setFeedbackError("");

      await submitArticleFeedback({
        articleId: publication._id,
        helpful,
        comment: comment.trim(),
        wantsToContribute: null,
      });

      setFeedbackSubmitted(true);
    } catch (error) {
      console.error("Article feedback error:", error);

      setFeedbackError(
        error.response?.data?.message ||
          "Unable to submit feedback. Please try again."
      );
    } finally {
      setFeedbackLoading(false);
    }
  };

  // ==========================================
  // CONTRIBUTION EMAIL
  // ==========================================

  const contributionMailto = contributionEmail
    ? `mailto:${contributionEmail}?subject=${encodeURIComponent(
        `Contribution for: ${publication.title || "AIA Article"}`
      )}&body=${encodeURIComponent(
        `Hello AIA Team,

I would like to share additional information, pointers or suggestions regarding the article "${publication.title || ""}".

My contribution:

`
      )}`
    : "";

  return (
    <main className="min-h-screen bg-white font-sans">
      {/* PRINT STYLES */}

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
              height: auto !important;
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

      {/* DOWNLOAD PDF */}

      {showDownloadButtons && canDownloadPdf && (
        <section className="no-print border-b border-gray-200 bg-[#F8FAFC] px-5 py-5 sm:px-8 lg:px-12">
          <div className="mx-auto flex max-w-[1100px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-semibold text-[#263247]">
                Save this article
              </h3>

              <p className="mt-1 text-xs text-gray-500">
                Download a PDF copy for future reference.
              </p>
            </div>

            <button
              type="button"
              onClick={handleDownloadPdf}
              className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#20466C] px-5 py-3 text-xs font-semibold text-white transition hover:bg-[#173653] sm:text-sm"
            >
              <FileDown size={17} />
              Download PDF
            </button>
          </div>
        </section>
      )}

      {/* ARTICLE CONTENT - PDF PRINT AREA */}

      <div id="article-print-content" className="article-print-content">
        <SplitFeatureCard
          eyebrow={publication.category || ""}
          title={publication.detailHeroTitle || publication.title}
          description={publication.detailHeroDescription || ""}
          image={publication.detailHeroImage || publication.image}
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

        {/* ARTICLE BODY */}

        <section className="bg-[#FCFCFD]">
          <div className="mx-auto w-full max-w-[1100px] px-5 py-8 sm:px-8 sm:py-10">
            {/* <ArticleBody
              introductionTitle={publication.introductionTitle}
              introductionParagraphs={
                publication.introductionParagraphs || []
              }
              contentBlocks={publication.contentBlocks || []}
              closingTitle={publication.closingTitle}
              closingParagraphs={publication.closingParagraphs || []}
              closingBullets={publication.closingBullets || []}
              author={publication.author}
            /> */}
            <ArticleBody
  introductionTitle={publication.introductionTitle}
  introductionParagraphs={
    publication.introductionParagraphs || []
  }
  contentBlocks={publication.contentBlocks || []}
  closingTitle={publication.closingTitle}
  closingParagraphs={publication.closingParagraphs || []}
  closingBullets={publication.closingBullets || []}
  author={publication.author}
  showReadMore={showReaderAction}
  onReadMore={onReadMore}
  loadingNextSegment={loadingNextSegment}
  registrationLoading={registrationLoading}
/>
          </div>
        </section>
      </div>

      {/* READ MORE / REGISTRATION ACTION */}

      {/* {showReaderAction && (
        <section className="no-print bg-[#FCFCFD] px-5 pb-10 sm:px-8">
          <div className="mx-auto max-w-[850px] border-t border-gray-200 pt-8 text-center">
            <p className="mb-4 text-sm text-gray-600">
              {segmentNumber === 1 ? "" : ""}
            </p>

            <button
              type="button"
              onClick={onReadMore}
              disabled={loadingNextSegment || registrationLoading}
              className="inline-flex min-w-[190px] items-center justify-center gap-2 rounded-sm bg-[#315778] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#263247] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loadingNextSegment ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  Loading...
                </>
              ) : (
                "Read More"
              )}
            </button>

            <p className="mt-3 text-xs text-gray-400">
              {segmentNumber === 1
                ? `500 of ${totalWords} words`
                : `1000 of ${totalWords} words`}
            </p>
          </div>
        </section>
      )} */}

      {/* ARTICLE FEEDBACK - ONLY AFTER SUCCESSFUL REGISTRATION */}

      {showArticleFeedback && readerRegistered && (
        <section className="no-print bg-white px-5 py-12 sm:px-8">
          <div className="mx-auto max-w-[850px] rounded-lg border border-gray-200 bg-[#FCFCFD] p-6 sm:p-8">
            <div className="mb-5 flex items-center gap-3">
              <MessageSquare
                size={21}
                className="text-[#315778]"
              />

              <h2 className="text-lg font-bold text-[#263247]">
                Was this article helpful?
              </h2>
            </div>

            {!feedbackSubmitted ? (
              <form onSubmit={handleFeedbackSubmit}>
                {/* STEP 1: HELPFUL YES / NO */}

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setHelpful(true);
                      setFeedbackError("");
                    }}
                    className={`rounded-md border px-7 py-2.5 text-sm font-medium transition ${
                      helpful === true
                        ? "border-[#315778] bg-[#315778] text-white"
                        : "border-gray-300 bg-white text-[#263247] hover:border-[#315778]"
                    }`}
                  >
                    Yes
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setHelpful(false);
                      setFeedbackError("");
                    }}
                    className={`rounded-md border px-7 py-2.5 text-sm font-medium transition ${
                      helpful === false
                        ? "border-[#315778] bg-[#315778] text-white"
                        : "border-gray-300 bg-white text-[#263247] hover:border-[#315778]"
                    }`}
                  >
                    No
                  </button>
                </div>

                {/* OPTIONAL COMMENT */}

                <div className="mt-6">
                  <label
                    htmlFor="article-feedback-comment"
                    className="mb-2 block text-sm font-semibold text-[#263247]"
                  >
                    Additional comments (optional)
                  </label>

                  <textarea
                    id="article-feedback-comment"
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your thoughts about this article..."
                    className="w-full resize-y rounded-md border border-gray-300 bg-white px-4 py-3 text-sm text-[#263247] outline-none transition focus:border-[#315778]"
                  />
                </div>

                {feedbackError && (
                  <p
                    className="mt-3 text-sm text-red-600"
                    role="alert"
                  >
                    {feedbackError}
                  </p>
                )}

                {/* SUBMIT INITIAL FEEDBACK */}

                <button
                  type="submit"
                  disabled={
                    feedbackLoading ||
                    typeof helpful !== "boolean"
                  }
                  className="mt-5 inline-flex items-center justify-center gap-2 rounded-md bg-[#315778] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#263247] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {feedbackLoading ? (
                    <>
                      <Loader2
                        size={16}
                        className="animate-spin"
                      />
                      Submitting...
                    </>
                  ) : (
                    "Submit Feedback"
                  )}
                </button>
              </form>
            ) : (
              /* FEEDBACK SUBMITTED */

              <div>
                <p className="text-sm font-medium text-green-700">
                  Thank you for your feedback!
                </p>

                {/* STEP 2: CONTRIBUTION QUESTION */}

                {helpful === true && (
                  <div className="mt-6 border-t border-gray-200 pt-5">
                    <h3 className="text-sm font-semibold text-[#263247]">
                      Would you like to contribute anything further to this
                      article?
                    </h3>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => setWantsToContribute(true)}
                        className={`rounded-md border px-7 py-2.5 text-sm font-medium transition ${
                          wantsToContribute === true
                            ? "border-[#315778] bg-[#315778] text-white"
                            : "border-gray-300 bg-white text-[#263247] hover:border-[#315778]"
                        }`}
                      >
                        Yes
                      </button>

                      <button
                        type="button"
                        onClick={() => setWantsToContribute(false)}
                        className={`rounded-md border px-7 py-2.5 text-sm font-medium transition ${
                          wantsToContribute === false
                            ? "border-[#315778] bg-[#315778] text-white"
                            : "border-gray-300 bg-white text-[#263247] hover:border-[#315778]"
                        }`}
                      >
                        No
                      </button>
                    </div>

                    {/* STEP 3: EMAIL BUTTON */}

                    {wantsToContribute === true && (
                      <div className="mt-5">
                        <p className="mb-3 text-sm leading-6 text-gray-600">
                          Thank you for your interest! You can share
                          additional information, pointers or suggestions
                          with the AIA Team using the email link below.
                        </p>

                        <a
                          href={contributionMailto}
                          className="inline-flex items-center gap-2 rounded-md bg-[#315778] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#263247]"
                        >
                          <Mail size={17} />
                          Email the AIA Team
                        </a>
                      </div>
                    )}

                    {wantsToContribute === false && (
                      <p className="mt-4 text-sm text-gray-500">
                        Thank you for sharing your feedback!
                      </p>
                    )}
                  </div>
                )}

                {helpful === false && (
                  <p className="mt-4 text-sm text-gray-500">
                    Thank you for helping us improve our articles.
                  </p>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ARTICLE NAVIGATION */}

      <div className="no-print mx-auto w-full max-w-[1100px] px-5 py-8 sm:px-8 sm:py-10">
        <ArticleNavigation
          previousArticle={previousArticle}
          nextArticle={nextArticle}
          basePath={basePath}
        />

        <div className="mt-8 border-t border-gray-200 pt-6 pb-10 text-center">
          <Link
            to={backLink}
            className="text-sm font-medium text-[#315778] underline underline-offset-4 transition hover:text-[#E87565]"
          >
            {backLabel}
          </Link>
        </div>
      </div>

      {/* REGISTRATION MODAL */}

      <SpecialArticleRegistrationModal
        isOpen={registrationOpen}
        onClose={onCloseRegistration}
        onSubmit={onRegisterReader}
      />
    </main>
  );
}
