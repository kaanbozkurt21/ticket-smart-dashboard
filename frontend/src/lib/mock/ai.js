// Mock AI responses for demo purposes

export const generateAISummary = (ticket) => {
  const summaries = [
    `Bu ticket, ${ticket.customer} tarafından ${ticket.priority === 'high' ? 'yüksek' : ticket.priority === 'medium' ? 'orta' : 'düşük'} öncelikli olarak açılmıştır. Konu "${ticket.subject}" başlığı altında raporlanmıştır. ${ticket.tags.join(', ')} kategorilerinde etiketlenmiştir. Şu anda ${ticket.assignee} tarafından işlenmektedir.`,
    `Özet: Müşteri ${ticket.customer}, ${ticket.subject} konusunda destek talebinde bulunmuştur. Ticket ${new Date(ticket.createdAt).toLocaleDateString('tr-TR')} tarihinde oluşturulmuştur ve ${ticket.status === 'open' ? 'henüz çözümlenmemiştir' : ticket.status === 'in-progress' ? 'çözüm sürecindedir' : 'çözümlenmiştir'}.`,
    `AI Analizi: Bu sorun ${ticket.tags.includes('technical') ? 'teknik bir problem' : 'müşteri hizmetleri meselesi'} olarak sınıflandırılmıştır. Önerilen çözüm süresi: ${ticket.priority === 'high' ? '2-4 saat' : ticket.priority === 'medium' ? '1-2 gün' : '3-5 gün'}. Benzer ticketlarda başarılı çözüm oranı: %87.`
  ];
  
  return summaries[Math.floor(Math.random() * summaries.length)];
};

export const generateDraftReply = (ticket) => {
  const replies = [
    `Merhaba ${ticket.customer},\n\nSorununuzu inceledik ve aşağıdaki adımları denemenizi öneriyoruz:\n\n1. Tarayıcı önbelleğinizi temizleyin\n2. Farklı bir tarayıcı ile tekrar deneyin\n3. VPN kullanıyorsanız kapatıp tekrar deneyin\n\nSorun devam ederse lütfen bize tekrar ulaşın.\n\nİyi günler,\n${ticket.assignee}`,
    `Sayın ${ticket.customer},\n\nBu konuda size yardımcı olmaktan memnuniyet duyarız. İlgili departmanımız konuyu incelemekte ve en kısa sürede size dönüş yapacaktır.\n\nOrtalama yanıt süremiz 24 saat olup, acil durumlar için öncelik verilmektedir.\n\nAnlayışınız için teşekkür ederiz.\n\nSaygılarımızla,\n${ticket.assignee}`,
    `Merhaba,\n\nBildiriminiz için teşekkür ederiz. Sorununuzu analiz ettik ve çözüm için gerekli işlemleri başlattık.\n\nGüncelleme: ${ticket.status === 'open' ? 'Ekibimiz konuyu incelemekte' : 'Çözüm sürecindeyiz'}.\n\nBaşka bir sorunuz olursa lütfen çekinmeden iletişime geçin.\n\nİyi çalışmalar,\n${ticket.assignee}`
  ];
  
  return replies[Math.floor(Math.random() * replies.length)];
};

export const generateInternalNote = () => {
  const notes = [
    'Müşteri ile telefon görüşmesi yapıldı. Problem detayları netleştirildi.',
    'Teknik ekibe yönlendirildi. Bug raporu oluşturuldu: #BUG-2431',
    'Benzer bir ticket daha önce çözülmüştü. Referans: TKT-987',
    'Müşteri memnuniyet anketi gönderildi. Yanıt bekleniyor.',
    'Çözüm onayı alındı. Ticket kapatılabilir.'
  ];
  
  return notes[Math.floor(Math.random() * notes.length)];
};
