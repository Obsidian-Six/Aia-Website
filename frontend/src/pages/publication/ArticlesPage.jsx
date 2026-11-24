// import React, { useEffect, useState } from "react";
// import SplitFeatureCard from "../../components/learn-more/SplitFeatureCard";
// import ArticleCardGrid from "../../components/publication/ArticleCardGrid";
// import { getArticles } from "../../services/api";

// const ArticlesPage = () => {
//   const [articles, setArticles] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     let mounted = true;

//     getArticles()
//       .then((data) => {
//         if (mounted) setArticles(data);
//       })
//       .catch((error) => {
//         console.error("Articles loading error:", error);
//       })
//       .finally(() => {
//         if (mounted) setLoading(false);
//       });

//     return () => {
//       mounted = false;
//     };
//   }, []);

//   return (
//     <main className="min-h-screen bg-white font-sans">
//       <SplitFeatureCard
//         eyebrow=""
//         title="All Articles"
//         description=""
//         image="/articles/articles-hero-img.png"
//         imageAlt="Smart manufacturing and industrial automation"
//         imagePosition="right"
//         background="dark"
//       />

//       {loading ? (
//         <p className="py-16 text-center text-sm text-gray-500">
//           Loading articles...
//         </p>
//       ) : articles.length ? (
//         <ArticleCardGrid items={articles} columns={4} />
//       ) : (
//         <p className="py-16 text-center text-sm text-gray-500">
//           No articles published yet.
//         </p>
//       )}
//     </main>
//   );
// };

// export default ArticlesPage;




import React, { useEffect, useState } from "react";
import SplitFeatureCard from "../../components/learn-more/SplitFeatureCard";
import ArticleCardGrid from "../../components/publication/ArticleCardGrid";
import { getArticles } from "../../services/api";

const ArticlesPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    getArticles()
      .then((data) => {
        if (mounted) {
          setArticles(Array.isArray(data) ? data : []);
        }
      })
      .catch((error) => {
        console.error("Articles loading error:", error);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-white font-sans">
      <SplitFeatureCard
        eyebrow=""
        title="All Articles"
        description=""
        image="/articles/articles-hero-img.png"
        imageAlt="Smart manufacturing and industrial automation"
        imagePosition="right"
        background="dark"
      />

      {/* Articles Count */}
      <section className="bg-white px-5 pt-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1250px]">
          <div className="flex items-center justify-between border-b border-gray-200 pb-6">
            <h2 className="text-lg font-semibold text-[#263247]">
              All Articles
            </h2>

            <p className="text-sm text-gray-500">
              {articles.length}{" "}
              {articles.length === 1 ? "article" : "articles"} found
            </p>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      {loading ? (
        <p className="py-16 text-center text-sm text-gray-500">
          Loading articles...
        </p>
      ) : articles.length > 0 ? (
        <ArticleCardGrid
          items={articles}
          columns={4}
        />
      ) : (
        <div className="py-16 text-center">
          <p className="text-sm text-gray-500">
            No articles found.
          </p>
        </div>
      )}
    </main>
  );
};

export default ArticlesPage;
