import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Bot, Sparkles, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { StatusPill } from '../components/custom/StatusPill';
import { PriorityBadge } from '../components/custom/PriorityBadge';
import { TagBadge } from '../components/custom/TagBadge';
import { formatDateTime } from '../lib/utils';
import ticketsData from '../lib/mock/tickets.json';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [showAISummary, setShowAISummary] = useState(false);
  const [showDraftReply, setShowDraftReply] = useState(false);

  useEffect(() => {
    const foundTicket = ticketsData.find(t => t.id === id);
    if (foundTicket) {
      setTicket(foundTicket);
    } else {
      navigate('/tickets');
    }
  }, [id, navigate]);

  const handleAISummary = () => {
    setShowAISummary(true);
    toast.success('AI özeti oluşturuldu');
  };

  const handleDraftReply = () => {
    const draftText = `Merhaba ${ticket.customer},\n\nSorununuzu inceledik. Detaylı bir çözüm önerisi aşağıda belirtilmiştir:\n\n- Adım 1: ...\n- Adım 2: ...\n\nDaha fazla yardıma ihtiyacınız olursa lütfen bize ulaşın.\n\nİyi günler,\nDestek Ekibi`;
    setReplyText(draftText);
    setShowDraftReply(true);
    toast.success('AI taslak yanıt hazırlandı');
  };

  const handleSendReply = () => {
    if (!replyText.trim()) {
      toast.error('Lütfen bir yanıt yazın');
      return;
    }
    toast.success('Yanıt gönderildi');
    setReplyText('');
    setShowDraftReply(false);
  };

  if (!ticket) {
    return <div>Yüklenyor...</div>;
  }

  const mockAISummary = `Bu ticket, ${ticket.customer} tarafından ${ticket.priority} öncelikli olarak açılmıştır. Konu "${ticket.subject}" başlığı altında raporlanmıştır. ${ticket.tags.join(', ')} kategorilerinde etiketlenmiştir. Şu anda ${ticket.assignee} tarafından işlenmektedir.`;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Link to="/tickets">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{ticket.id}</h1>
            <StatusPill status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
          </div>
          <p className="text-muted-foreground mt-1">{ticket.subject}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Açıklama</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{ticket.description}</p>
            </CardContent>
          </Card>

          {/* Messages */}
          <Card>
            <CardHeader>
              <CardTitle>Konuşma Geçmişi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {ticket.messages && ticket.messages.length > 0 ? (
                ticket.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${
                      msg.role === 'agent' ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium ${
                        msg.role === 'agent'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {msg.author.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-sm font-medium">{msg.author}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDateTime(msg.timestamp)}
                        </span>
                      </div>
                      <div
                        className={`text-sm p-3 rounded-lg ${
                          msg.role === 'agent'
                            ? 'bg-primary/10'
                            : 'bg-muted'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Henüz mesaj yok
                </p>
              )}
            </CardContent>
          </Card>

          {/* Reply Box */}
          <Card>
            <CardHeader>
              <CardTitle>Yanıt Yaz</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Yanıtınızı buraya yazın..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={6}
                className="resize-none"
              />
              <div className="flex gap-2">
                <Button onClick={handleSendReply}>
                  <Send className="mr-2 h-4 w-4" />
                  Gönder
                </Button>
                <Button variant="outline" onClick={handleDraftReply}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  AI Taslak Yanıt
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* AI Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                AI Yardımcısı
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={handleAISummary}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                AI Özeti
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={handleDraftReply}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Taslak Yanıt
              </Button>
              
              {showAISummary && (
                <div className="mt-4 p-3 bg-muted rounded-lg text-sm">
                  <p className="font-medium mb-2">AI Özeti:</p>
                  <p className="text-muted-foreground">{mockAISummary}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ticket Details */}
          <Card>
            <CardHeader>
              <CardTitle>Detaylar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Müşteri</p>
                <Link 
                  to={`/customers/${ticket.customerId}`}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  {ticket.customer}
                </Link>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Atanan</p>
                <p className="text-sm font-medium">{ticket.assignee}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Oluşturma</p>
                <p className="text-sm">{formatDateTime(ticket.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Güncelleme</p>
                <p className="text-sm">{formatDateTime(ticket.updatedAt)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Etiketler</p>
                <div className="flex flex-wrap gap-1">
                  {ticket.tags.map((tag, idx) => (
                    <TagBadge key={idx} tag={tag} />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
