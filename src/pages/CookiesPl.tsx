import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function CookiesHr() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-gray-900 pb-20">
      <div className="max-w-3xl mx-auto px-6 pt-12 md:pt-20">
        <Link to="/" className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-10 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Powrót do strony głównej
        </Link>
        
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-8">Polityka plików cookies</h1>
        
        <div className="prose prose-lg text-gray-600">
          <p className="mb-6">Na stronie internetowej kliksy.si („strona internetowa”) używamy plików cookies i podobnych technologii, aby zapewnić Państwu optymalne wrażenia z wizyty oraz prawidłowe działanie niektórych naszych procesów technicznych. Niniejsza polityka plików cookies informuje o rodzajach plików cookies, którymi zarządzamy, oraz o celu ich stosowania zgodnie z ustawą o komunikacji elektronicznej (ZEKom-1).</p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">1. Czym są pliki cookies?</h2>
          <p className="mb-6">Pliki cookies (ciasteczka) to małe pliki tekstowe, które są zapisywane na Twoim urządzeniu, gdy odwiedzasz naszą stronę internetową. Umożliwiają one rozpoznanie urządzenia i „zapamiętanie” niektórych Twoich wyborów (takich jak logowanie do systemu lub wybrany pakiet).</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">2. Jakich plików cookies używamy?</h2>
          
          <h3 className="text-xl font-bold text-gray-800 mt-6 mb-2">A. Niezbędne pliki cookies</h3>
          <p className="mb-6">Te pliki cookies są kluczowe, ponieważ umożliwiają poruszanie się po stronie internetowej, utrzymują zalogowanie w panelu użytkownika oraz zarządzają koszykiem lub procesem zakupu wydarzenia. Bez tych plików cookies podstawowe funkcjonalności nie działają, dlatego na takie pliki cookies zgoda prawna nie jest wymagana.</p>
          
          <h3 className="text-xl font-bold text-gray-800 mt-6 mb-2">B. Funkcjonalne i analityczne pliki cookies</h3>
          <p className="mb-6">Za pomocą tych plików cookies mierzymy odwiedzalność strony internetowej (Google Analytics i podobne narzędzia), co pomaga nam analizować działanie systemu i ulepszać treści. Te pliki cookies są ładowane na Twoim urządzeniu dopiero po wyrażeniu na to wyraźnej zgody.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">3. Jak można zarządzać plikami cookies?</h2>
          <p className="mb-6">Swoje ustawienia i preferencje dotyczące plików cookies możesz zawsze zmienić bezpośrednio w swojej przeglądarce internetowej, gdzie pliki cookies można całkowicie usunąć i wyłączyć.</p>
          <p className="mb-6">Ostrzegamy jednak, że wyłączenie wszystkich plików cookies (w szczególności niezbędnych plików cookies do samego logowania i opłacenia pakietu) uniemożliwi pomyślne korzystanie z aplikacji internetowej i tworzenie galerii.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">4. Informacje o zmianach</h2>
          <p className="mb-6">Niniejsza polityka może być od czasu do czasu aktualizowana w celu odzwierciedlenia zmian w oprogramowaniu lub wymogów prawnych. Data ostatniej aktualizacji będzie regularnie odnawiana przy wdrożeniu.</p>
        </div>
      </div>
    </div>
  );
}