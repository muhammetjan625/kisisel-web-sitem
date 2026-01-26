import React, { useState, useRef, useEffect } from 'react';
import { FaRobot, FaTimes, FaPaperPlane, FaUser } from 'react-icons/fa';
import './ChatBot.css';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Merhaba! 👋 Ben Muhammetjan'ın dijital asistanıyım. Aşağıdaki butonları kullanabilir veya bana soru sorabilirsin.", 
      sender: 'bot' 
    }
  ]);
  const [inputText, setInputText] = useState(""); // Yazılan metin
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Otomatik aşağı kaydırma
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen]);

  // --- BOT CEVAP MANTIĞI (Basit Yapay Zeka) ---
  const getBotResponse = (text) => {
    const lowerText = text.toLowerCase();

    if (lowerText.includes('merhaba') || lowerText.includes('selam')) 
      return "Selamlar! Hoş geldin. Sana nasıl yardımcı olabilirim? 😊";
    
    if (lowerText.includes('nasılsın') || lowerText.includes('naber')) 
      return "Ben bir botum, o yüzden harikayım! Kodlarım tıkır tıkır çalışıyor. Sen nasılsın? 🤖";

    if (lowerText.includes('iletişim') || lowerText.includes('mail') || lowerText.includes('ulaş')) 
      return "Bana 'İletişim' sayfasından veya muhammetjan@example.com adresinden ulaşabilirsin. 📩";

    if (lowerText.includes('proje') || lowerText.includes('yaptığın')) 
      return "Projelerimi 'Projeler' sayfasında sergiliyorum. Hepsini React ve Firebase ile geliştirdim. İncelemeni tavsiye ederim! 🚀";

    if (lowerText.includes('site') || lowerText.includes('teknoloji') || lowerText.includes('nasıl yaptın')) 
      return "Bu site React.js, Firebase ve tamamen özel CSS (Glassmorphism) kullanılarak yapıldı. Hazır UI kütüphanesi kullanılmadı! 💻";

    if (lowerText.includes('fiyat') || lowerText.includes('ücret')) 
      return "Fiyatlandırma projenin detaylarına göre değişiyor. İletişim sayfasından bana detayları yazarsan sana dönüş yapabilirim. 💼";

    if (lowerText.includes('kimsin') || lowerText.includes('kimdir')) 
      return "Ben Muhammetjan'ın oluşturduğu bir asistanım. Ama sahibim Samsun'da yaşayan tutkulu bir Frontend Geliştiricidir.";

    return "Bunu tam anlayamadım 😕. Ama istersen 'Projeler' veya 'İletişim' hakkında bilgi verebilirim. Aşağıdaki butonları da deneyebilirsin!";
  };

  // Mesaj Gönderme İşlemi
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // 1. Kullanıcı mesajını ekle
    const userMsg = { id: Date.now(), text: inputText, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInputText(""); // Inputu temizle
    setIsTyping(true);

    // 2. Botun cevabını hazırla
    setTimeout(() => {
      const botReplyText = getBotResponse(userMsg.text);
      setMessages(prev => [...prev, { id: Date.now() + 1, text: botReplyText, sender: 'bot' }]);
      setIsTyping(false);
    }, 1000); // 1 saniye düşünme süresi
  };

  // Hazır Butonlara Tıklayınca
  const handleQuickReply = (text) => {
    const userMsg = { id: Date.now(), text: text, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const botReplyText = getBotResponse(text); // Aynı mantığı kullan
      setMessages(prev => [...prev, { id: Date.now() + 1, text: botReplyText, sender: 'bot' }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="chatbot-wrapper">
      {isOpen && (
        <div className="chat-window fade-in-up">
          {/* Header */}
          <div className="chat-header">
            <div className="chat-title">
              <FaRobot className="bot-icon-header" />
              <div>
                <h4>Asistan Bot</h4>
                <span className="online-status">● Çevrimiçi</span>
              </div>
            </div>
            <button className="close-chat" onClick={() => setIsOpen(false)}><FaTimes /></button>
          </div>

          {/* Mesajlar */}
          <div className="chat-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`message ${msg.sender}`}>
                {msg.sender === 'bot' && <div className="avatar"><FaRobot /></div>}
                <div className="bubble">{msg.text}</div>
              </div>
            ))}
            {isTyping && (
              <div className="message bot">
                <div className="avatar"><FaRobot /></div>
                <div className="bubble typing"><span></span><span></span><span></span></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Hazır Öneriler (Chip) */}
          <div className="chat-suggestions">
            <button onClick={() => handleQuickReply("Projelerin neler?")}>Projeler</button>
            <button onClick={() => handleQuickReply("İletişim bilgileri")}>İletişim</button>
            <button onClick={() => handleQuickReply("Bu site nasıl yapıldı?")}>Teknolojiler</button>
          </div>

          {/* YENİ: Input Alanı */}
          <form className="chat-input-area" onSubmit={handleSendMessage}>
            <input 
              type="text" 
              placeholder="Bir şeyler yaz..." 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button type="submit" disabled={!inputText.trim()}>
              <FaPaperPlane />
            </button>
          </form>

        </div>
      )}

      <button className={`chatbot-toggle ${isOpen ? 'hidden' : ''}`} onClick={() => setIsOpen(true)}>
        <FaRobot size={24} />
        <span className="pulse-effect"></span>
      </button>
    </div>
  );
};

export default ChatBot;