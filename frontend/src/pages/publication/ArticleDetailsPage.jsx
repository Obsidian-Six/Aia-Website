// import React, { useEffect, useState } from "react";
// import { Link, useParams, Navigate } from "react-router-dom";

// import { getArticleBySlug, getArticles } from "../../services/api";
// import ArticleBody from "../../components/publication/ArticleBody";
// import ArticleNavigation from "../../components/publication/ArticleNavigation";
// import SplitFeatureCard from "../../components/learn-more/SplitFeatureCard";

// export default function ArticleDetailsPage() {
//   const { slug } = useParams();

//   const [article, setArticle] = useState(null);
//   const [articles, setArticles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [notFound, setNotFound] = useState(false);

//   useEffect(() => {
//     let mounted = true;

//     const loadArticle = async () => {
//       setLoading(true);
//       setNotFound(false);

//       try {
//         const [articleData, allArticles] = await Promise.all([
//           getArticleBySlug(slug),
//           getArticles(),
//         ]);

//         if (!mounted) return;

//         setArticle(articleData);
//         setArticles(allArticles);
//         setNotFound(!articleData);
//       } catch (error) {
//         if (mounted) {
//           console.error(error);
//           setNotFound(true);
//         }
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     };

//     loadArticle();

//     return () => {
//       mounted = false;
//     };
//   }, [slug]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         Loading article...
//       </div>
//     );
//   }

//   if (notFound || !article) {
//     return <Navigate to="/publication/articles" replace />;
//   }

//   const currentIndex = articles.findIndex(
//     (item) => item.slug === article.slug
//   );

//   const previousArticle =
//     currentIndex > 0 ? articles[currentIndex - 1] : null;

//   const nextArticle =
//     currentIndex >= 0 && currentIndex < articles.length - 1
//       ? articles[currentIndex + 1]
//       : null;

//   return (
//     <main className="min-h-screen bg-white font-sans">
//       <SplitFeatureCard
//         eyebrow=""
//         title="Driving India's Smart Manufacturing Mission"
//         description=""
//         image="/national-party.png"
//         imageAlt="Smart manufacturing and industrial automation"
//         imagePosition="right"
//         background="dark"
//       />

//       <article className="mx-auto w-full max-w-[1100px] px-5 py-8 sm:px-8 sm:py-12 lg:px-12">
//         <header className="mb-7 text-center">
//           <h1 className="mx-auto max-w-[850px] text-base font-bold leading-[1.4] text-[#263247] sm:text-[32px]">
//             {article.title}
//           </h1>

//           {article.introduction && (
//             <p className="mx-auto mt-4 max-w-[850px] text-base leading-[1.7] text-[#263247]">
//               {article.introduction}
//             </p>
//           )}

//           {article.category && (
//             <p className="mt-3 text-sm text-gray-500">
//               {article.category}
//             </p>
//           )}
//         </header>

//         {article.detailCoverImage && (
//           <figure className="mb-7">
//             <img
//               src={article.detailCoverImage}
//               alt={article.title}
//               className="max-h-[400px] w-full object-cover"
//               loading="eager"
//             />
//           </figure>
//         )}

//         <ArticleBody
//           sections={article.sections || []}
//           author={article.author}
//         />

//         <ArticleNavigation
//           previousArticle={previousArticle}
//           nextArticle={nextArticle}
//         />

//         <div className="mt-7 text-center">
//           <Link
//             to="/publication/articles"
//             className="text-base font-medium text-[#315778] underline underline-offset-4 hover:text-[#E87565]"
//           >
//             Back to all articles
//           </Link>
//         </div>
//       </article>
//     </main>
//   );
// }



// import React, { useEffect, useState } from "react";
// import { Navigate, useParams } from "react-router-dom";

// import {
//   getArticleBySlug,
//   getArticles,
// } from "../../services/api";

// import PublicationDetailLayout from "../../components/PublicationDetailLayout";

// export default function ArticleDetailsPage() {
//   const { slug } = useParams();

//   const [article, setArticle] = useState(null);
//   const [articles, setArticles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [notFound, setNotFound] = useState(false);

//   useEffect(() => {
//     let mounted = true;

//     const loadArticle = async () => {
//       setLoading(true);
//       setNotFound(false);

//       try {
//         const [articleData, allArticles] = await Promise.all([
//           getArticleBySlug(slug),
//           getArticles(),
//         ]);

//         if (!mounted) return;

//         setArticle(articleData);
//         setArticles(allArticles || []);
//         setNotFound(!articleData);
//       } catch (error) {
//         console.error("Article detail error:", error);

//         if (mounted) {
//           setNotFound(true);
//         }
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     };

//     loadArticle();

//     return () => {
//       mounted = false;
//     };
//   }, [slug]);

//   if (loading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center">
//         Loading article...
//       </div>
//     );
//   }

//   if (notFound || !article) {
//     return <Navigate to="/publication/articles" replace />;
//   }

//   const sortedArticles = [...articles].sort(
//     (a, b) => (a.order || 0) - (b.order || 0)
//   );

//   const currentIndex = sortedArticles.findIndex(
//     (item) =>
//       item._id === article._id ||
//       item.slug === article.slug
//   );

//   const previousArticle =
//     currentIndex > 0
//       ? sortedArticles[currentIndex - 1]
//       : null;

//   const nextArticle =
//     currentIndex >= 0 &&
//     currentIndex < sortedArticles.length - 1
//       ? sortedArticles[currentIndex + 1]
//       : null;

//   return (
//     <PublicationDetailLayout
//       publication={article}
//       previousArticle={previousArticle}
//       nextArticle={nextArticle}
//       backLink="/publication/articles"
//       backLabel="Back to all articles"
//       basePath="/publication/articles"
//     />
//   );
// }


// import React, { useEffect, useRef, useState } from "react";
// import { Navigate, useParams } from "react-router-dom";

// import {
//   getArticleBySlug,
//   getArticles,
// } from "../../services/api";

// import PublicationDetailLayout from "../../components/PublicationDetailLayout";
// import TextToSpeech from "../../components/common/TextToSpeech";

// export default function ArticleDetailsPage() {
//   const { slug } = useParams();

//   const contentRef = useRef(null);

//   const [article, setArticle] = useState(null);
//   const [articles, setArticles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [notFound, setNotFound] = useState(false);

//   useEffect(() => {
//     let mounted = true;

//     const loadArticle = async () => {
//       setLoading(true);
//       setNotFound(false);

//       try {
//         const [articleData, allArticles] = await Promise.all([
//           getArticleBySlug(slug),
//           getArticles(),
//         ]);

//         if (!mounted) return;

//         setArticle(articleData);
//         setArticles(allArticles || []);
//         setNotFound(!articleData);
//       } catch (error) {
//         console.error("Article detail error:", error);

//         if (mounted) {
//           setNotFound(true);
//         }
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     };

//     loadArticle();

//     return () => {
//       mounted = false;
//     };
//   }, [slug]);

//   if (loading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center">
//         Loading article...
//       </div>
//     );
//   }

//   if (notFound || !article) {
//     return <Navigate to="/industry-insight/articles" replace />;
//   }

//   const sortedArticles = [...articles].sort(
//     (a, b) => (a.order || 0) - (b.order || 0)
//   );

//   const currentIndex = sortedArticles.findIndex(
//     (item) =>
//       item._id === article._id ||
//       item.slug === article.slug
//   );

//   const previousArticle =
//     currentIndex > 0
//       ? sortedArticles[currentIndex - 1]
//       : null;

//   const nextArticle =
//     currentIndex >= 0 &&
//     currentIndex < sortedArticles.length - 1
//       ? sortedArticles[currentIndex + 1]
//       : null;

//   return (
//     <div ref={contentRef}>
//       <TextToSpeech
//         contentRef={contentRef}
//         title="Listen to this article"
//       />

//       <PublicationDetailLayout
//         publication={article}
//         previousArticle={previousArticle}
//         nextArticle={nextArticle}
//         backLink="/industry-insight/articles"
//       backLabel="Back to all articles"
//       basePath="/industry-insight/articles"
//       />
//     </div>
//   );
// }



import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Navigate, useParams } from "react-router-dom";

import {
  getArticleBySlug,
  getArticles,
  getNextArticleSegment,
  registerArticleReader,
} from "../../services/api";

import PublicationDetailLayout from "../../components/PublicationDetailLayout";
import TextToSpeech from "../../components/common/TextToSpeech";

export default function ArticleDetailsPage() {
  const { slug } = useParams();
  const contentRef = useRef(null);

  const [article, setArticle] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [accessGranted, setAccessGranted] = useState(false);
  const [totalWords, setTotalWords] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [currentSegment, setCurrentSegment] = useState("full");

  const [loadingNextSegment, setLoadingNextSegment] = useState(false);
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [registrationLoading, setRegistrationLoading] = useState(false);

const applyArticleResponse = useCallback((response) => {
  if (!response?.article) {
    setArticle(null);
    return;
  }

  setArticle(response.article);
  setAccessGranted(Boolean(response.accessGranted));

  const words = Number(response.totalWords || 0);

  setTotalWords(words);
  setHasMore(Boolean(response.hasMore));

  setCurrentSegment(
    response.accessGranted
      ? "full"
      : Number(response.currentSegment) || (words > 500 ? 1 : "full")
  );
}, []);

  // ==========================================
  // LOAD ARTICLE
  // ==========================================

  useEffect(() => {
    let mounted = true;

    const loadArticle = async () => {
      setLoading(true);
      setNotFound(false);

      try {
        const [articleResponse, allArticles] = await Promise.all([
          getArticleBySlug(slug),
          getArticles(),
        ]);

        if (!mounted) return;

        if (!articleResponse?.article) {
          setNotFound(true);
          return;
        }

        applyArticleResponse(articleResponse);
        setArticles(allArticles || []);
      } catch (error) {
        console.error("Article detail error:", error);

        if (mounted) {
          setNotFound(true);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadArticle();

    return () => {
      mounted = false;
    };
  }, [slug, applyArticleResponse]);

  // ==========================================
  // LOAD SECOND 500-WORD SEGMENT
  // ==========================================

  const handleReadMore = async () => {
   if (loadingNextSegment || accessGranted || totalWords <= 500) {
  return;
}

    // After 1000 words, ask the reader to register.
    if (Number(currentSegment) >= 2) {
  if (totalWords > 1000) {
    setRegistrationOpen(true);
  }
  return;
}

    try {
      setLoadingNextSegment(true);

      const response = await getNextArticleSegment(slug);

      if (!response?.article) {
        throw new Error("Unable to load the next article section.");
      }

      applyArticleResponse(response);
    } catch (error) {
      console.error("Next article segment error:", error);
      alert(
        error.response?.data?.message ||
          error.message ||
          "Unable to load more article content. Please try again."
      );
    } finally {
      setLoadingNextSegment(false);
    }
  };

  // ==========================================
  // REGISTER READER AND UNLOCK ALL ARTICLES
  // ==========================================

  const handleReaderRegistration = async (formData) => {
    try {
      setRegistrationLoading(true);

      await registerArticleReader({
        name: formData.name,
        email: formData.email,
        company: formData.company,
        phone: formData.phone,
        sourcePage: window.location.pathname,
      });

      // Fetch again after the access cookie is set.
      // This returns the complete article for registered readers.
      const response = await getArticleBySlug(slug);

      if (!response?.article || !response.accessGranted) {
        throw new Error(
          "Registration completed, but article access could not be verified. Please refresh the page."
        );
      }

      applyArticleResponse(response);
      setRegistrationOpen(false);

      return true;
    } catch (error) {
      console.error("Article reader registration error:", error);

      alert(
        error.response?.data?.message ||
          error.message ||
          "Registration failed. Please try again."
      );

      return false;
    } finally {
      setRegistrationLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading article...
      </div>
    );
  }

  if (notFound || !article) {
    return <Navigate to="/industry-insight/articles" replace />;
  }

  const sortedArticles = [...articles].sort(
    (a, b) => (a.order || 0) - (b.order || 0)
  );

  const currentIndex = sortedArticles.findIndex(
    (item) =>
      item._id === article._id ||
      item.slug === article.slug
  );

  const previousArticle =
    currentIndex > 0
      ? sortedArticles[currentIndex - 1]
      : null;

  const nextArticle =
    currentIndex >= 0 &&
    currentIndex < sortedArticles.length - 1
      ? sortedArticles[currentIndex + 1]
      : null;

  return (
    <div ref={contentRef}>
      <TextToSpeech
        contentRef={contentRef}
        title="Listen to this article"
      />

      <PublicationDetailLayout
        publication={article}
        previousArticle={previousArticle}
        nextArticle={nextArticle}
        backLink="/industry-insight/articles"
        backLabel="Back to all articles"
        basePath="/industry-insight/articles"

        showArticleFeedback={true}

        // Article access
        accessGranted={accessGranted}
        totalWords={totalWords}
        hasMore={hasMore}
        currentSegment={currentSegment}

        // Read More
        onReadMore={handleReadMore}
        loadingNextSegment={loadingNextSegment}

        // Reader registration
        registrationOpen={registrationOpen}
        onCloseRegistration={() => setRegistrationOpen(false)}
        onRegisterReader={handleReaderRegistration}
        registrationLoading={registrationLoading}

        contributionEmail="aiateam@gmail.com"
      />
    </div>
  );
}
