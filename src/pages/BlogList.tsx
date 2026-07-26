import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function BlogList() {
  return (
    <div className="min-h-screen bg-[#FDFCFB] font-sans text-gray-900">
      <Helmet>
        <title>Blog | Kliksy — nasveti za poroke in dogodke</title>
        <meta name="description" content="Nasveti za poroke, foto galerije in dogodke. Photo booth cena, QR koda za poroko in več." />
      </Helmet>

      {/* Navigation - copy from Landing for consistency but simplified */}
      <nav className="fixed w-full top-0 z-50 bg-[#FDFCFB]/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-[1280px] mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="font-extrabold text-[28px] tracking-tight text-gray-900 flex items-center gap-2">
            Kliksy<span className="text-[#5B45FF]">.</span>
          </Link>
          <div className="hidden lg:flex items-center gap-10 text-[15px] font-semibold text-gray-600">
             <Link to="/" className="hover:text-gray-900 transition-colors">Domov</Link>
             <Link to="/blog" className="text-gray-900 transition-colors">Blog</Link>
          </div>
          <div className="flex items-center gap-3">
             <Link to="/create" className="hidden sm:inline-flex bg-gray-900 text-white px-4 py-2 sm:px-6 sm:py-2.5 rounded-full text-[13px] sm:text-[15px] font-bold hover:bg-gray-800 transition-all shadow-md whitespace-nowrap">
              Ustvari dogodek
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-24 max-w-4xl mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-12">
          Blog — nasveti za poroke in dogodke
        </h1>

        <div className="grid gap-8">
          {/* Article Card */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <p className="text-sm font-semibold text-indigo-600 mb-2">Julij 2026</p>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Photo booth najem cena 2026 — Koliko stane in kaj je boljša alternativa?
            </h2>
            <p className="text-gray-600 mb-6 line-clamp-3">
              Koliko stane najem photo bootha za poroko? Cene od €300 do €800 in zakaj je Kliksy 10x cenejša alternativa.
            </p>
            <Link 
              to="/blog/photo-booth-najem-cena" 
              className="inline-flex items-center text-indigo-600 font-bold hover:text-indigo-800 transition-colors"
            >
              Preberi članek &rarr;
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
