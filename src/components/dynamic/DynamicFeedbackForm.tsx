import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Send, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { feedbackSchema } from '@/lib/validation';

const DynamicFeedbackForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact_number: '',
    feedback: '',
    suggestion: '',
    rating: 5
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data using zod schema
    const validation = feedbackSchema.safeParse({
      name: formData.name,
      email: formData.email || undefined,
      contact_number: formData.contact_number || undefined,
      feedback: formData.feedback,
      suggestion: formData.suggestion || undefined,
      rating: formData.rating || undefined
    });

    if (!validation.success) {
      const firstError = validation.error.errors[0];
      toast.error(firstError.message);
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('feedback')
        .insert([{
          name: formData.name.trim(),
          email: formData.email.trim() || null,
          contact_number: formData.contact_number || null,
          feedback: formData.feedback.trim(),
          suggestion: formData.suggestion.trim() || null,
          rating: formData.rating
        }]);

      if (error) throw error;

      toast.success('फीडबॅक यशस्वीरीत्या पाठवला गेला!');
      setFormData({
        name: '',
        email: '',
        contact_number: '',
        feedback: '',
        suggestion: '',
        rating: 5
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('फीडबॅक पाठवण्यात त्रुटी झाली');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 via-orange-100 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="cultural-shadow">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-marathi-orange mb-4">
              आपला अभिप्राय द्या
            </CardTitle>
            <p className="text-gray-600">
              आपल्या सुचना आणि अभिप्रायामुळे आम्हाला अधिक चांगली सेवा देण्यास मदत होईल
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    नाव *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="आपले पूर्ण नाव"
                    required
                    maxLength={100}
                    className="border-marathi-orange/30 focus:border-marathi-orange"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    ईमेल
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="आपला ईमेल पत्ता"
                    maxLength={255}
                    className="border-marathi-orange/30 focus:border-marathi-orange"
                  />
                </div>

                <div>
                  <label htmlFor="contact_number" className="block text-sm font-medium text-gray-700 mb-2">
                    संपर्क क्रमांक
                  </label>
                  <Input
                    id="contact_number"
                    name="contact_number"
                    value={formData.contact_number}
                    onChange={(e) => {
                      // Only allow digits, max 10
                      const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setFormData(prev => ({ ...prev, contact_number: value }));
                    }}
                    placeholder="आपला मोबाइल नंबर (10 अंक)"
                    maxLength={10}
                    pattern="[0-9]{10}"
                    className="border-marathi-orange/30 focus:border-marathi-orange"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    रेटिंग
                  </label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                        className={`p-1 ${star <= formData.rating ? 'text-marathi-orange' : 'text-gray-300'}`}
                      >
                        <Star className="h-6 w-6 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">
                  अभिप्राय *
                </label>
                <Textarea
                  id="feedback"
                  name="feedback"
                  value={formData.feedback}
                  onChange={handleInputChange}
                  placeholder="आपला अभिप्राय इथे लिहा..."
                  rows={4}
                  required
                  maxLength={2000}
                  className="border-marathi-orange/30 focus:border-marathi-orange"
                />
              </div>

              <div>
                <label htmlFor="suggestion" className="block text-sm font-medium text-gray-700 mb-2">
                  सुचना
                </label>
                <Textarea
                  id="suggestion"
                  name="suggestion"
                  value={formData.suggestion}
                  onChange={handleInputChange}
                  placeholder="आपल्या सुचना इथे लिहा..."
                  rows={3}
                  maxLength={2000}
                  className="border-marathi-orange/30 focus:border-marathi-orange"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-marathi-orange hover:bg-marathi-deepOrange text-white py-3 flex items-center justify-center gap-2"
              >
                <Send className="h-5 w-5" />
                {loading ? 'पाठवत आहे...' : 'अभिप्राय पाठवा'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default DynamicFeedbackForm;
