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



import React, { useEffect, useMemo, useState } from "react";
import SplitFeatureCard from "../../components/learn-more/SplitFeatureCard";
import ArticleCardGrid from "../../components/publication/ArticleCardGrid";
import { getArticles } from "../../services/api";

const filters = [
  "All Articles",
  "General Articles",
  "Special Articles",
];

const ArticlesPage = () => {
  const [articles, setArticles] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All Articles");
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

  // Temporary demo classification.
  // Once CMS integration is ready, this will come from the API.
  const classifiedArticles = useMemo(() => {
    return articles.map((item, index) => {
      const cmsType = String(
        item.accessType || item.articleType || ""
      ).toLowerCase();

      let isSpecial;

      if (typeof item.isSpecial === "boolean") {
        isSpecial = item.isSpecial;
      } else if (cmsType === "special") {
        isSpecial = true;
      } else if (cmsType === "general") {
        isSpecial = false;
      } else {
        // Demo: First article will appear as Special.
        isSpecial = index === 0;
      }

      return {
        ...item,
        isSpecial,
        accessType: isSpecial ? "special" : "general",
      };
    });
  }, [articles]);

  const filteredArticles = useMemo(() => {
    if (activeFilter === "Special Articles") {
      return classifiedArticles.filter((item) => item.isSpecial);
    }

    if (activeFilter === "General Articles") {
      return classifiedArticles.filter((item) => !item.isSpecial);
    }

    return classifiedArticles;
  }, [classifiedArticles, activeFilter]);

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

      {/* Article Filters */}
      <section className="bg-white px-5 pt-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1250px]">
          <div className="flex flex-col gap-5 border-b border-gray-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              {filters.map((filter) => {
                const isActive = activeFilter === filter;

                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter)}
                    className={`rounded-full border px-5 py-2.5 text-xs font-medium transition-all duration-300 sm:text-sm ${
                      isActive
                        ? "border-[#20466C] bg-[#20466C] text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:border-[#20466C] hover:text-[#20466C]"
                    }`}
                  >
                    {filter}
                  </button>
                );
              })}
            </div>

            <p className="text-sm text-gray-500">
              {filteredArticles.length}{" "}
              {filteredArticles.length === 1 ? "article" : "articles"} found
            </p>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      {loading ? (
        <p className="py-16 text-center text-sm text-gray-500">
          Loading articles...
        </p>
      ) : filteredArticles.length > 0 ? (
        <ArticleCardGrid
          items={filteredArticles}
          columns={4}
        />
      ) : (
        <div className="py-16 text-center">
          <p className="text-sm text-gray-500">
            No {activeFilter.toLowerCase()} found.
          </p>
        </div>
      )}
    </main>
  );
};

export default ArticlesPage;
