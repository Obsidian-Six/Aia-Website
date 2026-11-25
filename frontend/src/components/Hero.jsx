// import React, { useState, useEffect, useRef } from 'react'
// import { ChevronLeft, ChevronRight } from 'lucide-react'
// import { getBanners } from '../services/api'

// export default function Hero() {
//   const [banners, setBanners] = useState([
//     { _id: 'default', name: 'Hero Smart Manufacturing Engineer', imageUrl: '/hero-engineer.png', isActive: true, isDefault: true }
//   ])
//   const [currentIndex, setCurrentIndex] = useState(0)
//   const timerRef = useRef(null)

//   // Fetch banners from MongoDB
//   useEffect(() => {
//     let isMounted = true
//     getBanners().then((data) => {
//       if (isMounted && data && data.length > 0) {
//         const activeBanners = data.filter(b => b.isActive)
//         if (activeBanners.length > 0) {
//           const formatted = activeBanners.map(b => ({
//             ...b,
//             isDefault: b.imageUrl === '/hero-engineer.png' || (b.name && b.name.toLowerCase().includes('engineer'))
//           }))
//           setBanners(formatted)
          
//           // Eager preloading
//           formatted.forEach(b => {
//             const img = new Image()
//             img.src = b.imageUrl
//           })
//         }
//       }
//     }).catch(console.error)

//     return () => { isMounted = false }
//   }, [])

//   // Auto-slide carousel every 6 seconds if multiple banners exist
//   useEffect(() => {
//     if (banners.length > 1) {
//       timerRef.current = setInterval(() => {
//         setCurrentIndex((prev) => (prev + 1) % banners.length)
//       }, 6000)
//     }
//     return () => {
//       if (timerRef.current) clearInterval(timerRef.current)
//     }
//   }, [banners.length])

//   const handleNext = () => {
//     setCurrentIndex((prev) => (prev + 1) % banners.length)
//   }

//   const handlePrev = () => {
//     setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1))
//   }

//   const currentBanner = banners[currentIndex] || banners[0]
//   const isDefaultArchBanner = currentBanner?.isDefault

//   return (
//     <section 
//       id="home" 
//       className={`relative text-white overflow-hidden font-sans select-none ${
//         isDefaultArchBanner ? 'bg-[#0B131E] pt-16 pb-20' : 'h-[540px] sm:h-[600px] lg:h-[650px] w-full flex items-center'
//       }`}
//     >
      
//       {/* 1. Full Image Cover Mode for Newly Uploaded Custom Banners */}
//       {!isDefaultArchBanner && (
//         <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
//           <img 
//             src={currentBanner.imageUrl} 
//             alt={currentBanner.name || 'Hero Banner'} 
//             className="w-full h-full object-cover object-center block"
//           />
//           {/* Subtle clean contrast backplate for text readability */}
//           <div className="absolute inset-0 bg-black/40"></div>
//         </div>
//       )}

//       {/* 2. Star/Grid Dots Background for Default Theme */}
//       {isDefaultArchBanner && (
//         <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:32px_32px]"></div>
//       )}

//       <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10 w-full">
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
//           {/* Left Column: Headline and CTAs */}
//           <div className={`${isDefaultArchBanner ? 'lg:col-span-7' : 'lg:col-span-8'} space-y-6 text-left`}>
            
//             <h1 className="text-4xl sm:text-5xl lg:text-[58px] leading-[1.12] text-white tracking-tight drop-shadow-md">
//               <span className="font-normal text-white">Accelerating </span>
//               <span className="font-extrabold text-white">India’s</span>
//               <br />
//               <span className="font-extrabold text-white">Smart Manufacturing</span>
//               <br />
//               <span className="font-normal text-white">Revolution</span>
//             </h1>

//             {/* Subtitle */}
//             <p className="text-sm sm:text-base text-gray-200 max-w-lg leading-relaxed font-normal pt-2 drop-shadow-sm">
//               Empowering manufacturers through AI, Industry 4.0, Industrial Automation, Digital Transformation and Collaborative Innovation.
//             </p>

//             {/* CTA Buttons */}
//             <div className="flex flex-wrap items-center gap-4 pt-4">
//               <a 
//                 href="#build-factory"
//                 className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-white text-[#E25238] font-bold text-sm shadow-lg hover:bg-gray-100 transition-all hover:scale-105 active:scale-95"
//               >
//                 Explore Smart Factory
//               </a>

//               <a 
//                 href="#services"
//                 className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-transparent hover:bg-white/10 text-white font-medium text-sm border border-white transition-all hover:scale-105 active:scale-95"
//               >
//                 Watch Video
//               </a>
//             </div>

//           </div>

//           {/* Right Column: Exact Default Seed Banner Layout with Right Arch & Doodle Annotations */}
//           {isDefaultArchBanner ? (
//             <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
//               <div className="relative w-full max-w-[440px]">
                
//                 {/* Top-Left Curved Arrow */}
//                 <svg 
//                   className="absolute -top-8 -left-12 w-28 h-20 text-white pointer-events-none hidden sm:block z-20" 
//                   viewBox="0 0 100 60" 
//                   fill="none"
//                 >
//                   <path d="M10 15 C 45 15, 75 25, 82 50" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
//                   <path d="M72 44 L 82 50 L 84 38" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
//                 </svg>

//                 {/* Top-Right Sparkle */}
//                 <svg 
//                   className="absolute -top-7 right-24 w-6 h-6 text-white pointer-events-none hidden sm:block z-20" 
//                   viewBox="0 0 24 24" 
//                   fill="none" 
//                   stroke="white" 
//                   strokeWidth="2.2"
//                 >
//                   <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M5.6 18.4L18.4 5.6" strokeLinecap="round" />
//                 </svg>

//                 {/* Top-Right Circle Doodle */}
//                 <div className="absolute -top-2 right-6 w-6 h-6 rounded-full border-2 border-white pointer-events-none hidden sm:block z-20"></div>

//                 {/* Arch Frame */}
//                 <div className="relative w-full rounded-t-[140px] rounded-b-2xl overflow-hidden drop-shadow-2xl bg-[#0F2338]">
//                   <img 
//                     src={currentBanner.imageUrl} 
//                     alt={currentBanner.name} 
//                     loading="eager"
//                     decoding="sync"
//                     className="w-full h-[460px] sm:h-[490px] object-cover object-bottom select-none"
//                   />
//                 </div>

//                 {/* Right-side Curved Doodle Arrow */}
//                 <svg 
//                   className="absolute top-1/2 -right-10 w-10 h-28 text-white pointer-events-none hidden sm:block z-20" 
//                   viewBox="0 0 40 100" 
//                   fill="none"
//                 >
//                   <path d="M10 10 C 35 35, 35 65, 12 88" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
//                   <path d="M22 78 L 12 88 L 10 74" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
//                 </svg>

//                 {/* Bottom-Left Circle Gauge Icon */}
//                 <div className="absolute -bottom-6 -left-6 pointer-events-none hidden sm:block z-20">
//                   <svg className="w-14 h-14" viewBox="0 0 50 50" fill="none">
//                     <circle cx="25" cy="25" r="16" stroke="white" strokeWidth="4.5" />
//                     <path d="M25 9 A 16 16 0 0 1 41 25 L 25 25 Z" fill="#0B131E" />
//                     <path d="M25 25 L 25 9" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
//                   </svg>
//                 </div>

//                 {/* Bottom-Right Small Circles */}
//                 <div className="absolute bottom-16 -right-5 w-3.5 h-3.5 rounded-full border-2 border-white pointer-events-none hidden sm:block z-20"></div>
//                 <div className="absolute -bottom-2 right-12 w-3.5 h-3.5 rounded-full border-2 border-white pointer-events-none hidden sm:block z-20"></div>

//               </div>
//             </div>
//           ) : null}

//         </div>

//         {/* Carousel Navigation Indicator Dots & Arrow Controls */}
//         {banners.length > 1 && (
//           <div className="mt-8 flex items-center justify-between max-w-xs mx-auto bg-black/50 px-4 py-2 rounded-full backdrop-blur-md border border-white/10 shadow-lg">
//             <button
//               onClick={handlePrev}
//               className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/30 text-white flex items-center justify-center transition"
//               aria-label="Previous Slide"
//             >
//               <ChevronLeft className="w-4 h-4" />
//             </button>

//             <div className="flex items-center gap-2">
//               {banners.map((_, i) => (
//                 <button
//                   key={i}
//                   onClick={() => setCurrentIndex(i)}
//                   className={`h-2.5 rounded-full transition-all ${
//                     i === currentIndex ? 'w-6 bg-[#E25238]' : 'w-2 bg-white/50 hover:bg-white'
//                   }`}
//                   aria-label={`Slide ${i + 1}`}
//                 />
//               ))}
//             </div>

//             <button
//               onClick={handleNext}
//               className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/30 text-white flex items-center justify-center transition"
//               aria-label="Next Slide"
//             >
//               <ChevronRight className="w-4 h-4" />
//             </button>
//           </div>
//         )}

//       </div>
//     </section>
//   )
// }


// import React, { useCallback, useEffect, useRef, useState } from 'react'
// import { Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react'
// import { getBanners } from '../services/api'

// const FALLBACK_BANNERS = [
//   {
//     _id: 'default',
//     name: "Building the automation backbone of India's factories.",
//     title: "Building the automation backbone of India's factories.",
//     description:
//       'Empowering manufacturers to build and sustain solutions based on Industrial Automation, Robotics, Industry 4.0, AI and Collaborative Innovation.',
//     imageUrl: '/hero-engineer.png',
//     isActive: true,
//     ctaPrimaryText: 'Become a Member',
//     ctaPrimaryUrl: '#membership',
//     ctaSecondaryText: 'Explore Smart Factory',
//     ctaSecondaryUrl: '#build-factory',
//   },
// ]

// const getMediaUrl = (banner) =>
//   banner?.videoUrl || banner?.mediaUrl || banner?.imageUrl || banner?.image || ''

// const isVideoBanner = (banner) => {
//   const url = getMediaUrl(banner)
//   const type = String(banner?.mediaType || banner?.type || '').toLowerCase()
//   return (
//     type === 'video' ||
//     type === 'mp4' ||
//     Boolean(banner?.videoUrl) ||
//     /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(url)
//   )
// }

// export default function Hero() {
//   const [banners, setBanners] = useState(FALLBACK_BANNERS)
//   const [currentIndex, setCurrentIndex] = useState(0)
//   const [isVideoPlaying, setIsVideoPlaying] = useState(true)
//   const videoRef = useRef(null)
//   const currentBanner = banners[currentIndex] || FALLBACK_BANNERS[0]
//   const mediaUrl = getMediaUrl(currentBanner)
//   const hasVideo = isVideoBanner(currentBanner)

//   useEffect(() => {
//     let isMounted = true

//     getBanners()
//       .then((data) => {
//         if (!isMounted || !Array.isArray(data)) return
//         const activeBanners = data.filter((banner) => banner?.isActive)
//         if (activeBanners.length) {
//           setBanners(activeBanners)
//           setCurrentIndex(0)
//           // Preload image banners. Video playback is handled by the video element.
//           activeBanners.forEach((banner) => {
//             if (!isVideoBanner(banner)) {
//               const url = getMediaUrl(banner)
//               if (url) {
//                 const img = new Image()
//                 img.src = url
//               }
//             }
//           })
//         }
//       })
//       .catch((error) => console.error('Failed to load hero banners:', error))

//     return () => {
//       isMounted = false
//     }
//   }, [])

//   // Auto-advance when there are multiple banners. A video banner remains playable
//   // and its own controls are shown only while that video is the active media.
//   useEffect(() => {
//     if (banners.length < 2) return undefined
//     const timer = window.setInterval(() => {
//       setCurrentIndex((index) => (index + 1) % banners.length)
//     }, 6000)
//     return () => window.clearInterval(timer)
//   }, [banners.length])

//   useEffect(() => {
//     setIsVideoPlaying(true)
//     if (hasVideo && videoRef.current) {
//       const video = videoRef.current
//       video.currentTime = 0
//       const playPromise = video.play()
//       if (playPromise?.catch) playPromise.catch(() => setIsVideoPlaying(false))
//     }
//   }, [currentIndex, hasVideo, mediaUrl])

//   const goTo = useCallback(
//     (index) => setCurrentIndex((index + banners.length) % banners.length),
//     [banners.length],
//   )

//   const toggleVideoPlayback = async () => {
//     const video = videoRef.current
//     if (!video) return

//     if (video.paused) {
//       try {
//         await video.play()
//         setIsVideoPlaying(true)
//       } catch (error) {
//         console.error('Video playback could not start:', error)
//         setIsVideoPlaying(false)
//       }
//     } else {
//       video.pause()
//       setIsVideoPlaying(false)
//     }
//   }

//   const title =
//     currentBanner?.title || currentBanner?.heading || currentBanner?.name ||
//     "Building the automation backbone of India's factories."
//   const description =
//     currentBanner?.description || currentBanner?.subtitle ||
//     'Empowering manufacturers to build and sustain solutions based on Industrial Automation, Robotics, Industry 4.0, AI and Collaborative Innovation.'
//   const primaryText = currentBanner?.ctaPrimaryText || currentBanner?.buttonText || 'Become a Member'
//   const primaryUrl = currentBanner?.ctaPrimaryUrl || currentBanner?.buttonUrl || '#membership'
//   const secondaryText = currentBanner?.ctaSecondaryText || 'Explore Smart Factory'
//   const secondaryUrl = currentBanner?.ctaSecondaryUrl || '#build-factory'

//   return (
//     <section
//       id="home"
//       className="relative isolate flex min-h-[390px] w-full items-center overflow-hidden bg-[#101311] font-sans text-white sm:min-h-[460px] lg:min-h-[540px]"
//     >
//       {/* Background media: image banners render an image; video banners render a video. */}
//       <div className="absolute inset-0 -z-20 overflow-hidden bg-[#101311]">
//         {hasVideo ? (
//           <video
//             key={mediaUrl}
//             ref={videoRef}
//             className="h-full w-full object-cover object-center"
//             src={mediaUrl}
//             autoPlay
//             muted
//             loop
//             playsInline
//             preload="auto"
//             onPlay={() => setIsVideoPlaying(true)}
//             onPause={() => setIsVideoPlaying(false)}
//             aria-label={title}
//           />
//         ) : mediaUrl ? (
//           <img
//             key={mediaUrl}
//             src={mediaUrl}
//             alt={currentBanner?.name || title}
//             className="h-full w-full object-cover object-center"
//             loading={currentIndex === 0 ? 'eager' : 'lazy'}
//           />
//         ) : null}
//       </div>

//       {/* Dark overlay closely matching the supplied reference screenshot. */}
//       <div className="absolute inset-0 -z-10 bg-black/65" />
//       <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/65 via-black/35 to-black/20" />

//       <div className="mx-auto flex w-full max-w-[1440px] items-center px-5 py-14 sm:px-8 sm:py-16 lg:px-[8.5%] lg:py-20">
//         <div className="max-w-[660px] animate-[heroFadeIn_.65s_ease-out]">
//           <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/75 sm:text-xs">
//             {currentBanner?.eyebrow || currentBanner?.tagline || ''}
//           </p>

//           <h1 className="max-w-[650px] whitespace-pre-line text-[30px] font-semibold leading-[1.12] tracking-[-0.035em] drop-shadow-md sm:text-[38px] lg:text-[48px]">
//             {title}
//           </h1>

//           <p className="mt-4 max-w-[490px] text-[12px] leading-[1.6] text-white/85 drop-shadow sm:mt-5 sm:text-sm">
//             {description}
//           </p>

//           <div className="mt-5 flex flex-wrap items-center gap-2 sm:mt-6 sm:gap-3">
//             <a
//               href={primaryUrl}
//               className="inline-flex min-h-[34px] items-center justify-center rounded-[4px] bg-[#f15d4e] px-3.5 py-2 text-[10px] font-semibold text-white transition-colors hover:bg-[#dc493b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:text-[11px]"
//             >
//               {primaryText}
//             </a>
//             {secondaryText && (
//               <a
//                 href={secondaryUrl}
//                 className="inline-flex min-h-[34px] items-center justify-center rounded-[4px] border border-white/75 bg-black/10 px-3.5 py-2 text-[10px] font-medium text-white transition-colors hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:text-[11px]"
//               >
//                 {secondaryText}
//               </a>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Playback control is deliberately rendered only for video media. */}
//       {hasVideo && (
//         <button
//           type="button"
//           onClick={toggleVideoPlayback}
//           className="absolute bottom-5 right-5 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-[#e86b5e] text-white shadow-lg transition hover:scale-105 hover:bg-[#d95649] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:bottom-7 sm:right-7 sm:h-9 sm:w-9"
//           aria-label={isVideoPlaying ? 'Pause background video' : 'Play background video'}
//           title={isVideoPlaying ? 'Pause video' : 'Play video'}
//         >
//           {isVideoPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="translate-x-[1px]" />}
//         </button>
//       )}

//       {/* Carousel controls are independent from the media playback control. */}
//       {banners.length > 1 && (
//         <div className="absolute bottom-5 left-5 z-20 flex items-center gap-3 sm:bottom-7 sm:left-8 lg:left-[8.5%]">
//           <button
//             type="button"
//             onClick={() => goTo(currentIndex - 1)}
//             className="flex h-7 w-7 items-center justify-center rounded-full border border-white/35 bg-black/25 text-white transition hover:bg-white/20"
//             aria-label="Previous banner"
//           >
//             <ChevronLeft size={15} />
//           </button>
//           <div className="flex items-center gap-1.5" aria-label="Choose banner">
//             {banners.map((banner, index) => (
//               <button
//                 key={banner._id || banner.id || index}
//                 type="button"
//                 onClick={() => goTo(index)}
//                 aria-label={`Go to banner ${index + 1}`}
//                 aria-current={index === currentIndex ? 'true' : undefined}
//                 className={`h-1.5 rounded-full transition-all ${
//                   index === currentIndex ? 'w-5 bg-[#f15d4e]' : 'w-1.5 bg-white/60 hover:bg-white'
//                 }`}
//               />
//             ))}
//           </div>
//           <button
//             type="button"
//             onClick={() => goTo(currentIndex + 1)}
//             className="flex h-7 w-7 items-center justify-center rounded-full border border-white/35 bg-black/25 text-white transition hover:bg-white/20"
//             aria-label="Next banner"
//           >
//             <ChevronRight size={15} />
//           </button>
//         </div>
//       )}

//       <style>{`
//         @keyframes heroFadeIn {
//           from { opacity: 0; transform: translateY(8px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         @media (prefers-reduced-motion: reduce) {
//           section * { animation: none !important; transition: none !important; }
//         }
//       `}</style>
//     </section>
//   )
// }






// import React, { useEffect, useRef, useState } from "react";
// import { Link } from "react-router-dom";

// const API_URL = (
//   import.meta.env.VITE_API_URL || "http://localhost:5000/api"
// ).replace(/\/+$/, "");

// const BACKEND_URL = API_URL.replace(/\/api$/i, "");

// // Convert old localhost and relative upload URLs to production backend URLs
// const getMediaUrl = (mediaPath) => {
//   if (!mediaPath) return "";

//   try {
//     if (/^https?:\/\//i.test(mediaPath)) {
//       const url = new URL(mediaPath);

//       if (
//         url.hostname === "localhost" ||
//         url.hostname === "127.0.0.1"
//       ) {
//         return `${BACKEND_URL}${url.pathname}${url.search}${url.hash}`;
//       }

//       return mediaPath;
//     }

//     return `${BACKEND_URL}/${mediaPath.replace(/^\/+/, "")}`;
//   } catch (error) {
//     console.error("Invalid media URL:", mediaPath, error);
//     return "";
//   }
// };

// const FALLBACK_HERO = {
//   title: "Building the automation backbone of India's factories.",
//   description:
//     "Empowering manufacturers to build and sustain solutions based on Industrial Automation, Robotics, Industry 4.0, AI and Collaborative Innovation.",
//   videoUrl: "",
//   youtubeUrl: "https://www.youtube.com/watch?v=VIDEO_ID",
//   ctaPrimaryText: "Connect with us",
//   ctaPrimaryUrl: "#membership",
//   ctaSecondaryText: "Explore Smart Factory",
//   ctaSecondaryUrl: "/learn-more",
// };

// export default function Hero({ onBecomeMemberClick }) {
//   const videoRef = useRef(null);

//   const [hero, setHero] = useState(FALLBACK_HERO);
//   const [videoFailed, setVideoFailed] = useState(false);
//   const [videoLoaded, setVideoLoaded] = useState(false);

//   // Resolve background video URL
//   const heroVideoUrl = getMediaUrl(hero.videoUrl);

//   // Fetch home hero data
//   useEffect(() => {
//     const controller = new AbortController();

//     const fetchHero = async () => {
//       try {
//         const response = await fetch(`${API_URL}/banners`, {
//           signal: controller.signal,
//         });

//         const result = await response.json();

//         if (!response.ok || !result.success) {
//           throw new Error(result.message || "Unable to load hero.");
//         }

//         const activeHero = result.data?.find(
//           (item) => item.isActive && (item.videoUrl || item.youtubeUrl)
//         );

//         if (activeHero) {
//           setHero({
//             ...FALLBACK_HERO,
//             ...activeHero,
//           });

//           setVideoFailed(false);
//           setVideoLoaded(false);
//         }
//       } catch (error) {
//         if (error.name !== "AbortError") {
//           console.error("Home hero API error:", error);
//         }
//       }
//     };

//     fetchHero();

//     return () => controller.abort();
//   }, []);

//   // Automatically play background video
//   useEffect(() => {
//     const video = videoRef.current;

//     if (!video || !heroVideoUrl || videoFailed) return;

//     video.muted = true;
//     video.defaultMuted = true;
//     video.playsInline = true;

//     video.setAttribute("muted", "");
//     video.setAttribute("playsinline", "");
//     video.setAttribute("webkit-playsinline", "");

//     const playVideo = async () => {
//       try {
//         await video.play();
//       } catch (error) {
//         console.warn(
//           "Browser blocked automatic hero video playback:",
//           error
//         );
//       }
//     };

//     if (video.readyState >= 2) {
//       playVideo();
//     } else {
//       video.addEventListener("loadeddata", playVideo, {
//         once: true,
//       });
//     }

//     return () => {
//       video.removeEventListener("loadeddata", playVideo);
//     };
//   }, [heroVideoUrl, videoFailed]);

//   // Video loaded
//   const handleVideoLoaded = () => {
//     setVideoLoaded(true);
//     setVideoFailed(false);
//   };

//   // Video error
//   const handleVideoError = () => {
//     setVideoFailed(true);
//     setVideoLoaded(false);

//     console.error("Hero video could not be loaded:", heroVideoUrl);
//   };

//   return (
//     <section
//       id="home"
//       className="relative isolate flex min-h-[390px] w-full items-center overflow-hidden bg-[#111] font-sans text-white sm:min-h-[460px] lg:min-h-[540px]"
//     >
//       {/* Background video */}
//       {heroVideoUrl && !videoFailed && (
//         <video
//           ref={videoRef}
//           key={heroVideoUrl}
//           src={heroVideoUrl}
//           muted
//           loop
//           playsInline
//           autoPlay
//           preload="auto"
//           controls={false}
//           onLoadedData={handleVideoLoaded}
//           onError={handleVideoError}
//           className="absolute inset-0 z-0 block h-full w-full object-cover"
//         />
//       )}

//       {/* Video loading fallback */}
//       {heroVideoUrl && !videoLoaded && !videoFailed && (
//         <div className="absolute inset-0 z-0 bg-[#111]" />
//       )}

//       {/* Dark overlay */}
//       <div className="pointer-events-none absolute inset-0 z-10 bg-black/60" />

//       <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-black/70 via-black/35 to-black/20" />

//       {/* Hero content */}
//       <div className="pointer-events-none relative z-20 mx-auto flex w-full max-w-[1440px] items-center px-5 py-14 sm:px-8 sm:py-16 lg:px-[8.5%] lg:py-20">
//         <div className="max-w-[660px]">
//           <h1 className="max-w-[650px] whitespace-pre-line text-[30px] font-semibold leading-[1.12] tracking-[-0.035em] drop-shadow-md sm:text-[38px] lg:text-[48px]">
//             {hero.title || FALLBACK_HERO.title}
//           </h1>

//           <p className="mt-4 max-w-[490px] text-[12px] leading-[1.6] text-white/85 sm:mt-5 sm:text-sm">
//             {hero.description || FALLBACK_HERO.description}
//           </p>

//           <div className="mt-5 flex flex-wrap items-center gap-2 sm:mt-6 sm:gap-3">
//             {hero.ctaPrimaryText && (
//               <Link
//                 to="/membership"
//                 className="pointer-events-auto inline-flex min-h-[34px] items-center justify-center rounded-[4px] bg-[#f15d4e] px-3.5 py-2 text-[10px] font-semibold text-white transition hover:bg-[#dc493b] sm:text-[11px]"
//               >
//                 {hero.ctaPrimaryText}
//               </Link>
//             )}

//             {hero.ctaSecondaryText && (
//               <a
//                 href={hero.ctaSecondaryUrl || "#build-factory"}
//                 className="pointer-events-auto inline-flex min-h-[34px] items-center justify-center rounded-[4px] border border-white/75 bg-black/10 px-3.5 py-2 text-[10px] font-medium text-white transition hover:bg-white/15 sm:text-[11px]"
//               >
//                 {hero.ctaSecondaryText}
//               </a>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Watch on YouTube button */}
//       {hero.youtubeUrl && (
//         <a
//           href={hero.youtubeUrl}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="absolute bottom-5 right-5 z-30 inline-flex min-h-10 items-center justify-center rounded-[4px] border border-white/50 bg-[#e86b5e] px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:scale-105 hover:bg-[#d95649] sm:bottom-7 sm:right-7"
//           aria-label="Watch video on YouTube"
//         >
//           Watch on YouTube
//         </a>
//       )}
//     </section>
//   );
// }




import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  X,
  Play,
  ArrowLeft,
  ArrowRight,
  Loader2,
  AlertCircle,
  ClipboardList,
} from "lucide-react";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

const BACKEND_URL = API_URL.replace(/\/api$/i, "");

const getMediaUrl = (mediaPath) => {
  if (!mediaPath) return "";

  try {
    if (/^https?:\/\//i.test(mediaPath)) {
      const url = new URL(mediaPath);

      if (
        url.hostname === "localhost" ||
        url.hostname === "127.0.0.1"
      ) {
        return `${BACKEND_URL}${url.pathname}${url.search}${url.hash}`;
      }

      return mediaPath;
    }

    return `${BACKEND_URL}/${mediaPath.replace(/^\/+/, "")}`;
  } catch (error) {
    console.error("Invalid media URL:", mediaPath, error);
    return "";
  }
};

const FALLBACK_HERO = {
  title: "Building the automation backbone of India's factories.",
  description:
    "Empowering manufacturers to build and sustain solutions based on Industrial Automation, Robotics, Industry 4.0, AI and Collaborative Innovation.",
  videoUrl: "",
  youtubeUrl: "",
  ctaPrimaryText: "Connect with us",
  ctaPrimaryUrl: "#membership",
  ctaSecondaryText: "Explore Smart Factory",
  ctaSecondaryUrl: "/learn-more",
};

// Extract YouTube video ID from supported URL formats
const getYouTubeVideoId = (url = "") => {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.replace(/^www\./, "");

    if (hostname === "youtu.be") {
      return parsedUrl.pathname.split("/")[1] || "";
    }

    if (
      hostname === "youtube.com" ||
      hostname === "m.youtube.com" ||
      hostname === "youtube-nocookie.com"
    ) {
      if (parsedUrl.pathname === "/watch") {
        return parsedUrl.searchParams.get("v") || "";
      }

      const match = parsedUrl.pathname.match(
        /^\/(embed|shorts|live)\/([^/?]+)/
      );

      return match?.[2] || "";
    }

    return "";
  } catch {
    return "";
  }
};

const getYouTubeEmbedUrl = (url) => {
  const videoId = getYouTubeVideoId(url);

  return videoId
    ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`
    : "";
};

export default function Hero({ onBecomeMemberClick }) {
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const [hero, setHero] = useState(FALLBACK_HERO);
  const [videoFailed, setVideoFailed] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Smart Factory popup states
  const [showSmartFactory, setShowSmartFactory] = useState(false);
  const [smartFactoryVideos, setSmartFactoryVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videosLoading, setVideosLoading] = useState(false);
  const [videosError, setVideosError] = useState("");

  const heroVideoUrl = getMediaUrl(hero.videoUrl);

  // Fetch existing Home Hero
  useEffect(() => {
    const controller = new AbortController();

    const fetchHero = async () => {
      try {
        const response = await fetch(`${API_URL}/banners`, {
          signal: controller.signal,
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Unable to load hero.");
        }

        const activeHero = result.data?.find(
          (item) => item.isActive && (item.videoUrl || item.youtubeUrl)
        );

        if (activeHero) {
          setHero({
            ...FALLBACK_HERO,
            ...activeHero,
          });

          setVideoFailed(false);
          setVideoLoaded(false);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Home hero API error:", error);
        }
      }
    };

    fetchHero();

    return () => controller.abort();
  }, []);

  // Automatically play background video
  useEffect(() => {
    const video = videoRef.current;

    if (!video || !heroVideoUrl || videoFailed) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");

    const playVideo = async () => {
      try {
        await video.play();
      } catch (error) {
        console.warn("Browser blocked automatic hero video playback:", error);
      }
    };

    if (video.readyState >= 2) {
      playVideo();
    } else {
      video.addEventListener("loadeddata", playVideo, { once: true });
    }

    return () => {
      video.removeEventListener("loadeddata", playVideo);
    };
  }, [heroVideoUrl, videoFailed]);

  // Fetch Smart Factory videos when popup opens
  useEffect(() => {
    if (!showSmartFactory) return;

    const controller = new AbortController();

    const fetchSmartFactoryVideos = async () => {
      setVideosLoading(true);
      setVideosError("");

      try {
        const response = await fetch(
          `${API_URL}/smart-factory-videos`,
          { signal: controller.signal }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Unable to load Smart Factory videos."
          );
        }

        const videos = Array.isArray(result.data) ? result.data : [];

        const activeVideos = videos.filter(
          (item) => item.isActive !== false && item.youtubeUrl
        );

        setSmartFactoryVideos(activeVideos);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Smart Factory videos:", error);
          setVideosError(error.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setVideosLoading(false);
        }
      }
    };

    fetchSmartFactoryVideos();

    return () => controller.abort();
  }, [showSmartFactory]);

  // Stop video and close popup with Escape
  useEffect(() => {
    if (!showSmartFactory) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setShowSmartFactory(false);
        setSelectedVideo(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showSmartFactory]);

  const handleVideoLoaded = () => {
    setVideoLoaded(true);
    setVideoFailed(false);
  };

  const handleVideoError = () => {
    setVideoFailed(true);
    setVideoLoaded(false);
    console.error("Hero video could not be loaded:", heroVideoUrl);
  };

  const closeSmartFactory = () => {
    setShowSmartFactory(false);
    setSelectedVideo(null);
  };

  const startAssessment = (video) => {
    const params = new URLSearchParams({
      videoId: String(video._id),
      videoTitle: video.title || "",
    });

    closeSmartFactory();

    navigate(`/manufacturers-self-assessment?${params.toString()}`);
  };

  const isExploreSmartFactory =
    hero.ctaSecondaryText?.trim().toLowerCase() ===
    "explore smart factory";

  return (
    <>
      <section
        id="home"
        className="relative isolate flex min-h-[390px] w-full items-center overflow-hidden bg-[#111] font-sans text-white sm:min-h-[460px] lg:min-h-[540px]"
      >
        {/* Existing background video - unchanged */}
        {heroVideoUrl && !videoFailed && (
          <video
            ref={videoRef}
            key={heroVideoUrl}
            src={heroVideoUrl}
            muted
            loop
            playsInline
            autoPlay
            preload="auto"
            controls={false}
            onLoadedData={handleVideoLoaded}
            onError={handleVideoError}
            className="absolute inset-0 z-0 block h-full w-full object-cover"
          />
        )}

        {heroVideoUrl && !videoLoaded && !videoFailed && (
          <div className="absolute inset-0 z-0 bg-[#111]" />
        )}

        <div className="pointer-events-none absolute inset-0 z-10 bg-black/60" />

        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-black/70 via-black/35 to-black/20" />

        {/* Hero content */}
        <div className="pointer-events-none relative z-20 mx-auto flex w-full max-w-[1440px] items-center px-5 py-14 sm:px-8 sm:py-16 lg:px-[8.5%] lg:py-20">
          <div className="max-w-[660px]">
            <h1 className="max-w-[650px] whitespace-pre-line text-[30px] font-semibold leading-[1.12] tracking-[-0.035em] drop-shadow-md sm:text-[38px] lg:text-[48px]">
              {hero.title || FALLBACK_HERO.title}
            </h1>

            <p className="mt-4 max-w-[490px] text-[12px] leading-[1.6] text-white/85 sm:mt-5 sm:text-sm">
              {hero.description || FALLBACK_HERO.description}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-2 sm:mt-6 sm:gap-3">
              {hero.ctaPrimaryText && (
                <Link
                  to="/membership"
                  className="pointer-events-auto inline-flex min-h-[34px] items-center justify-center rounded-[4px] bg-[#f15d4e] px-3.5 py-2 text-[10px] font-semibold text-white transition hover:bg-[#dc493b] sm:text-[11px]"
                >
                  {hero.ctaPrimaryText}
                </Link>
              )}

              {hero.ctaSecondaryText && (
                isExploreSmartFactory ? (
                  <button
                    type="button"
                    onClick={() => setShowSmartFactory(true)}
                    className="pointer-events-auto inline-flex min-h-[34px] items-center justify-center rounded-[4px] border border-white/75 bg-black/10 px-3.5 py-2 text-[10px] font-medium text-white transition hover:bg-white/15 sm:text-[11px]"
                  >
                    {hero.ctaSecondaryText}
                  </button>
                ) : (
                  <a
                    href={hero.ctaSecondaryUrl || "#build-factory"}
                    className="pointer-events-auto inline-flex min-h-[34px] items-center justify-center rounded-[4px] border border-white/75 bg-black/10 px-3.5 py-2 text-[10px] font-medium text-white transition hover:bg-white/15 sm:text-[11px]"
                  >
                    {hero.ctaSecondaryText}
                  </a>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Smart Factory Popup */}
      {showSmartFactory && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeSmartFactory();
            }
          }}
        >
          <div className="relative max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-xl bg-white text-slate-900 shadow-2xl">
            <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-7">
              <div>
                <h2 className="text-lg font-bold sm:text-2xl">
                  Explore Smart Factory
                </h2>
                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  Explore automation and smart manufacturing.
                </p>
              </div>

              <button
                type="button"
                onClick={closeSmartFactory}
                aria-label="Close popup"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5 sm:p-7">
              {videosLoading ? (
                <div className="flex min-h-60 items-center justify-center gap-3 text-slate-500">
                  <Loader2 className="animate-spin" size={24} />
                  Loading Smart Factory videos...
                </div>
              ) : videosError ? (
                <div className="flex min-h-48 flex-col items-center justify-center gap-3 text-center">
                  <AlertCircle className="text-red-500" size={30} />
                  <p className="text-sm text-red-600">{videosError}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setShowSmartFactory(false);
                      setTimeout(() => setShowSmartFactory(true), 0);
                    }}
                    className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white"
                  >
                    Try Again
                  </button>
                </div>
              ) : smartFactoryVideos.length === 0 ? (
                <div className="flex min-h-48 flex-col items-center justify-center text-center">
                  <Play size={34} className="mb-3 text-slate-300" />
                  <h3 className="font-semibold">Videos coming soon</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Smart Factory videos will be available here.
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
                  {/* Video list */}
                  <div>
                    <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500">
                      Available Videos
                    </h3>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                      {smartFactoryVideos.map((video) => {
                        const thumbnail = getMediaUrl(
                          video.thumbnailUrl || video.thumbnail
                        );

                        const isSelected =
                          selectedVideo?._id === video._id;

                        return (
                          <button
                            key={video._id}
                            type="button"
                            onClick={() => setSelectedVideo(video)}
                            className={`group flex w-full gap-3 rounded-lg border p-2 text-left transition ${
                              isSelected
                                ? "border-[#ed654f] bg-orange-50"
                                : "border-slate-200 hover:border-slate-400"
                            }`}
                          >
                            <div className="relative aspect-video w-36 shrink-0 overflow-hidden rounded-md bg-slate-100 sm:w-44">
                              {thumbnail ? (
                                <img
                                  src={thumbnail}
                                  alt={video.title}
                                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center">
                                  <Play className="text-slate-400" />
                                </div>
                              )}

                              <span className="absolute inset-0 flex items-center justify-center bg-black/20">
                                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#e85f4d]">
                                  <Play size={17} fill="currentColor" />
                                </span>
                              </span>
                            </div>

                            <div className="min-w-0 flex-1 py-1">
                              <h4 className="line-clamp-2 text-sm font-semibold text-slate-900">
                                {video.title}
                              </h4>
                              <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                                {video.description}
                              </p>
                              <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#e85f4d]">
                                Watch video <ArrowRight size={13} />
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Selected video player */}
                  <div>
                    <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500">
                      {selectedVideo ? "Now Playing" : "Select a video"}
                    </h3>

                    {selectedVideo ? (
                      <div>
                        <div className="aspect-video overflow-hidden rounded-lg bg-black">
                          {getYouTubeEmbedUrl(selectedVideo.youtubeUrl) ? (
                            <iframe
                              key={selectedVideo._id}
                              src={getYouTubeEmbedUrl(selectedVideo.youtubeUrl)}
                              title={selectedVideo.title || "Smart Factory video"}
                              className="h-full w-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowFullScreen
                              referrerPolicy="strict-origin-when-cross-origin"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center p-5 text-center text-sm text-white">
                              Invalid YouTube URL. Please contact the administrator.
                            </div>
                          )}
                        </div>

                        <h3 className="mt-4 text-lg font-bold">
                          {selectedVideo.title}
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {selectedVideo.description}
                        </p>

                        <button
                          type="button"
                          onClick={() => startAssessment(selectedVideo)}
                          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#ed654f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#d9503c]"
                        >
                          <ClipboardList size={17} />
                          Start Self-Assessment
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex aspect-video flex-col items-center justify-center rounded-lg bg-slate-100 p-6 text-center">
                        <Play size={38} className="mb-3 text-slate-300" />
                        <p className="text-sm font-medium text-slate-600">
                          Select any video to start watching
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
