import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyHr() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-gray-900 pb-20">
      <div className="max-w-3xl mx-auto px-6 pt-12 md:pt-20">
        <Link to="/" className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-10 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Powrót do strony głównej
        </Link>
        
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-8">Polityka prywatności</h1>
        
        <div className="prose prose-lg text-gray-600">
          <p className="mb-6">Ochrona Twoich danych osobowych jest dla nas bardzo ważna. W niniejszej polityce prywatności wyjaśniamy, jakie dane osobowe zbieramy, jak je wykorzystujemy, przechowujemy i chronimy zgodnie z Ogólnym Rozporządzeniem o Ochronie Danych (RODO) oraz słoweńskim prawodawstwem (ZVOP-1 i ZVOP-2).</p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">1. Administrator danych osobowych</h2>
          <p className="mb-6">Administratorem danych osobowych jest firma (dalej: my, Kliksy.si). W przypadku wszelkich pytań dotyczących przetwarzania Twoich danych, prosimy o kontakt pod adresem info@kliksy.si.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">2. Dane, które zbieramy</h2>
          <p className="mb-6">W celu świadczenia naszych usług przekazujesz nam określone informacje:</p>
          <ul className="list-disc pl-6 mb-6">
            <li>Podstawowe dane twórcy wydarzenia (imię, adres e-mail, ewentualne dane firmy, jeśli zakup dotyczy firmy) w celu realizacji płatności i otwarcia wydarzenia.</li>
            <li>Dane dotyczące wydarzenia (nazwa wydarzenia, data, wybrany pakiet).</li>
            <li>Zdjęcia i inne materiały wizualne przesłane przez gości/uczestników w ramach wirtualnej galerii.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">3. Cel i podstawa prawna</h2>
          <p className="mb-6">Zebrane dane osobowe przetwarzamy przede wszystkim w celu:</p>
          <ul className="list-disc pl-6 mb-6">
            <li><strong>Realizacja umowy:</strong> Tworzenie Twojego wydarzenia, wysyłanie kodów QR i potwierdzeń płatności, utrzymanie dostępu do galerii.</li>
            <li><strong>Obowiązki prawne:</strong> Wystawianie faktur i rozpatrywanie ewentualnych reklamacji (przechowywanie zgodnie z przepisami podatkowymi).</li>
            <li><strong>Uzasadniony interes:</strong> Regularne informowanie klientów i zapobieganie nadużyciom w naszych systemach.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">4. Przetwarzanie zdjęć</h2>
          <p className="mb-6">Kliksy.si zapewnia jedynie przestrzeń do przechowywania. Chociaż dbamy o bezpieczeństwo i zapobiegamy dostępowi do danych za pomocą bezpiecznych linków URL, podkreślamy, że pełna odpowiedzialność za przesłane zdjęcia zawsze spoczywa na organizatorze danego wydarzenia, który ponosi również odpowiedzialność za informowanie i uzyskanie odpowiednich zgód od swoich gości na robienie zdjęć.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">5. Przekazywanie stronom trzecim</h2>
          <p className="mb-6">Nigdy nie sprzedajemy ani nie wypożyczamy Twoich danych osobowych nieuprawnionym stronom trzecim. W niektórych przypadkach dane są przetwarzane przez naszych procesorów umownych (na przykład Stripe do realizacji bezpiecznych płatności lub Firebase do bezpiecznego przechowywania i bazy danych), którzy są ściśle zobowiązani do przestrzegania wysokich standardów bezpieczeństwa informacji i zgodności z RODO.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">6. Okres przechowywania i prawa użytkowników</h2>
          <p className="mb-6">Twoje dane przechowujemy tak długo, jak jest to niezbędne do osiągnięcia celów lub zgodnie z wybranym pakietem przy zakupie inteligentnej galerii (1 rok, 2 lata...). Po upływie tego okresu dane są anonimizowane lub trwale usuwane.</p>
          <p className="mb-6">Zgodnie z RODO masz prawo do dostępu, sprostowania, usunięcia ("prawo do bycia zapomnianym"), ograniczenia przetwarzania i sprzeciwu. Wnioski przyjmujemy na adres e-mail info@kliksy.si.</p>
        </div>
      </div>
    </div>
  );
}