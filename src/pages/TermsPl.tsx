import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function TermsHr() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-gray-900 pb-20">
      <div className="max-w-3xl mx-auto px-6 pt-12 md:pt-20">
        <Link to="/" className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-10 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Powrót do strony głównej
        </Link>
        
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-8">Regulamin</h1>
        
        <div className="prose prose-lg text-gray-600">
          <p className="mb-6">Ogólne warunki handlowe i korzystania ze strony internetowej kliksy.si zostały sporządzone zgodnie z ustawą o ochronie konsumentów, ustawą o ochronie danych osobowych, ogólnym rozporządzeniem o ochronie danych (RODO) oraz ustawą o komunikacji elektronicznej.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">1. Postanowienia ogólne</h2>
          <p className="mb-6">Korzystając z serwisu kliksy.si, potwierdzasz, że zapoznałeś się i akceptujesz niniejsze warunki korzystania. Usługa umożliwia tworzenie wirtualnych galerii do przechowywania i udostępniania zdjęć z wydarzeń.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">2. Korzystanie z usługi i tworzenie wydarzeń</h2>
          <p className="mb-6">Tworząc wydarzenie na naszej platformi, wykupujesz dostęp do wirtualnej galerii, w której Twoi klienci/goście mogą przesyłać zdjęcia. Użytkownik jest zobowiązany do korzystania z platformy zgodnie z przepisami.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 bg-yellow-100 px-4 py-2 rounded-lg inline-block">3. Odpowiedzialność za przesłane treści (Ważne)</h2>
          <p className="mb-6 font-medium text-gray-800">
            Organizatorzy lub dostawcy (użytkownicy), którzy tworzą i otwierają wydarzenie na naszej platformie, ponoszą pełną i wyłączną odpowiedzialność za wszystkie zdjęcia, filmy i inne treści, które oni lub ich goście prześlą do danej wirtualnej galerii. 
          </p>
          <p className="mb-6">
            Kliksy.si (operator platformy) działa wyłącznie jako dostawca rozwiązania technologicznego lub infrastruktury informatycznej ułatwiającej zbieranie zdjęć i nie weryfikuje ręcznie każdego przesłanego zdjęcia. Jeśli w galerii pojawią się treści nieodpowiednie, sporne pod kątem praw autorskich lub niezgodne z prawem (np. nagość, przemoc, treści bezprawne), obowiązkiem i odpowiedzialnością twórcy wydarzenia jest regularne przeglądanie tych zdjęć i ich natychmiastowe usuwanie za pomocą narzędzi (dostępnych w panelu administracyjnym).
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">4. Ceny i płatności</h2>
          <p className="mb-6">Wszystkie ceny na stronie podane są w złotych (zł). Płatności są realizowane za pośrednictwem bezpiecznego połączenia (Stripe). Na wszystkie wpłaty wystawiamy odpowiednie faktury, które są zgodne z obowiązującym prawem.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">5. Prawo do odstąpienia od umowy i reklamacje</h2>
          <p className="mb-6">Zgodnie z przepisami o ochronie praw konsumentów, użytkownik ma prawo poinformować nas o odstąpieniu od umowy w ciągu 14 dni i zażądać zwrotu pieniędzy w ramach naszej procedury reklamacyjnej oraz naszej 30-dniowej gwarancji satysfakcji. Zwrot zostanie dokonany przy użyciu tego samego środka płatniczego.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">6. Ograniczenie odpowiedzialności operatora</h2>
          <p className="mb-6">Platforma zapewnia wysoką niezawodność dostępu do danych, niemniej jednak operator nie ponosi odpowiedzialności za ewentualne przerwy w działaniu serwerów będące poza jego kontrolą.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">7. Postanowienia końcowe</h2>
          <p className="mb-6">Regulamin wchodzi w życie z dniem publikacji. Operator zastrzega sobie prawo do zmiany warunków, o czym użytkownicy zostaną poinformowani z odpowiednim wyprzedzeniem.</p>
        </div>
      </div>
    </div>
  );
}