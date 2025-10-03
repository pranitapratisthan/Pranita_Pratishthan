import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from './Navbar';
// Admin SubTabs
import AdminPhotoGalleryTab from './admin/AdminPhotoGalleryTab';
import AdminYouTubeTab from './admin/AdminYouTubeTab';
import AdminNewsTab from './admin/AdminNewsTab';
import AdminTimelineTab from './admin/AdminTimelineTab';
import AdminProjectsTab from './admin/AdminProjectsTab';
import AdminFeedbackTab from './admin/AdminFeedbackTab';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useSupabaseMEL } from '@/contexts/SupabaseMELContext';

interface AdminPanelProps {
  onBack?: () => void;
}

const AdminPanel = ({ onBack }: AdminPanelProps) => {
  const [tab, setTab] = useState('popup');

  const {
    popup,
    updatePopup,
    fetchPopup,
    president,
    secretary,
    updatePresidentSecretary,
    fetchPresidentAndSecretary,
    loading
  } = useSupabaseMEL();

  const [editingPopup, setEditingPopup] = useState({
    enabled: false,
    title: '',
    description: '',
    date: '',
    location: '',
    banner_file: null as File|null,
    banner_image_url: '',
  });

  useEffect(() => {
    if (popup) {
      setEditingPopup({
        enabled: Boolean(popup.enabled),
        title: popup.title || '',
        description: popup.description || '',
        date: popup.date || '',
        location: popup.location || '',
        banner_file: null,
        banner_image_url: popup.banner_image_url || '',
      });
    }
  }, [popup]);

  const [editingPresident, setEditingPresident] = useState({
    name: '',
    message: '',
    photo: null as File|null,
    photo_url: '',
  });
  const [editingSecretary, setEditingSecretary] = useState({
    name: '',
    message: '',
    photo: null as File|null,
    photo_url: '',
  });
  useEffect(() => {
    if (president) {
      setEditingPresident({
        name: president.name,
        message: president.bio || '',
        photo: null,
        photo_url: president.photo_url || '',
      });
    }
    if (secretary) {
      setEditingSecretary({
        name: secretary.name,
        message: secretary.bio || '',
        photo: null,
        photo_url: secretary.photo_url || '',
      });
    }
  }, [president, secretary]);

  const handleUpdatePopup = async () => {
    await updatePopup({
      ...editingPopup,
      banner_file: editingPopup.banner_file,
      id: popup?.id,
    });
    await fetchPopup();
  };

  const handlePresidentUpdate = async () => {
    await updatePresidentSecretary({
      id: president?.id,
      name: editingPresident.name,
      role: 'president',
      bio: editingPresident.message,
      photo_url: editingPresident.photo_url,
      photo_file: editingPresident.photo, // The File object
    });
    await fetchPresidentAndSecretary();
  };

  const handleSecretaryUpdate = async () => {
    await updatePresidentSecretary({
      id: secretary?.id,
      name: editingSecretary.name,
      role: 'secretary',
      bio: editingSecretary.message,
      photo_url: editingSecretary.photo_url,
      photo_file: editingSecretary.photo, // The File object
    });
    await fetchPresidentAndSecretary();
  };

  return (
    <section className="py-20 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            {onBack && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={onBack}
                className="border-marathi-orange text-marathi-orange hover:bg-marathi-orange hover:text-white"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                मागे
              </Button>
            )}
            <h2 className="text-4xl font-bold text-marathi-orange">
              साइट सेटिंग्स
            </h2>
          </div>
          <div className="w-24 h-1 saffron-gradient mx-auto mb-6"></div>
        </div>

        {/* Tabs List */}
        <Tabs defaultValue="popup" className="w-full">
          <TabsList className="grid w-full grid-cols-8 mb-8">
            <TabsTrigger value="popup">पॉपअप</TabsTrigger>
            <TabsTrigger value="youtube">YouTube</TabsTrigger>
            <TabsTrigger value="gallery">फोटो गॅलरी</TabsTrigger>
            <TabsTrigger value="news">बातम्या</TabsTrigger>
            <TabsTrigger value="timeline">टाइमलाइन</TabsTrigger>
            <TabsTrigger value="programs">प्रकल्प</TabsTrigger>
            <TabsTrigger value="feedback">प्रतिक्रिया</TabsTrigger>
            <TabsTrigger value="organization">संस्था माहिती</TabsTrigger>
          </TabsList>

          <TabsContent value="popup">
            <Card>
              <CardHeader>
                <CardTitle className="text-marathi-orange">पॉपअप व्यवस्थापन</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6 max-w-2xl mx-auto">
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editingPopup.enabled}
                        onChange={e => setEditingPopup({ ...editingPopup, enabled: e.target.checked })}
                        className="rounded border-marathi-orange"
                      />
                      <span className="text-sm font-medium">पॉपअप सक्षम करा</span>
                    </label>
                  </div>
                  <Input
                    placeholder="कार्यक्रमाचे नाव"
                    value={editingPopup.title}
                    onChange={e => setEditingPopup({ ...editingPopup, title: e.target.value })}
                    className="w-full"
                  />
                  <Input
                    placeholder="दिनांक आणि वेळ"
                    value={editingPopup.date}
                    onChange={e => setEditingPopup({ ...editingPopup, date: e.target.value })}
                    className="w-full"
                  />
                  <Input
                    placeholder="ठिकाण"
                    value={editingPopup.location}
                    onChange={e => setEditingPopup({ ...editingPopup, location: e.target.value })}
                    className="w-full"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      बॅनर इमेज (upload any aspect ratio)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => {
                        const file = e.target.files?.[0] || null;
                        setEditingPopup({ ...editingPopup, banner_file: file });
                      }}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                    {editingPopup.banner_image_url && (
                      <div className="mt-3">
                        <img
                          src={editingPopup.banner_image_url}
                          alt="Popup Banner"
                          className="rounded-lg mx-auto max-h-56 max-w-full object-contain"
                          style={{
                            aspectRatio: 'auto',
                            width: 'auto',
                            height: 'auto',
                            maxWidth: '100%',
                            maxHeight: '220px'
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <Textarea
                    placeholder="तपशील"
                    rows={3}
                    value={editingPopup.description}
                    onChange={e => setEditingPopup({ ...editingPopup, description: e.target.value })}
                    className="w-full"
                  />
                  <Button
                    className="bg-marathi-orange hover:bg-marathi-deepOrange text-white w-full"
                    onClick={handleUpdatePopup}
                  >
                    पॉपअप अपडेट करा
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gallery">
            <AdminPhotoGalleryTab />
          </TabsContent>
          <TabsContent value="youtube">
            <AdminYouTubeTab />
          </TabsContent>
          <TabsContent value="news">
            <AdminNewsTab />
          </TabsContent>
          <TabsContent value="timeline">
            <AdminTimelineTab />
          </TabsContent>
          <TabsContent value="programs">
            <AdminProjectsTab />
          </TabsContent>
          <TabsContent value="feedback">
            <AdminFeedbackTab />
          </TabsContent>

          <TabsContent value="organization">
            <Card>
              <CardHeader>
                <CardTitle className="text-marathi-orange">संस्था माहिती व्यवस्थापन</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8 max-w-4xl mx-auto">
                  <div className="border rounded-lg p-6">
                    <h3 className="text-xl font-bold text-marathi-orange mb-4">अध्यक्ष माहिती</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <Input
                          placeholder="अध्यक्षाचे नाव"
                          value={editingPresident.name}
                          onChange={e => setEditingPresident({ ...editingPresident, name: e.target.value })}
                          className="w-full"
                        />
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            फोटो (वैकल्पिक)
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={e => {
                              const file = e.target.files?.[0] || null;
                              setEditingPresident({ ...editingPresident, photo: file });
                            }}
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                          />
                          {editingPresident.photo_url && (
                            <img
                              src={editingPresident.photo_url}
                              alt="President"
                              className="rounded-lg mt-2 w-auto max-h-32 max-w-xs object-contain"
                            />
                          )}
                        </div>
                      </div>
                      <div>
                        <Textarea
                          placeholder="अध्यक्षाचा संदेश/माहिती"
                          rows={6}
                          value={editingPresident.message}
                          onChange={e => setEditingPresident({ ...editingPresident, message: e.target.value })}
                          className="w-full"
                        />
                      </div>
                    </div>
                    <Button
                      className="bg-marathi-orange hover:bg-marathi-deepOrange mt-4"
                      onClick={handlePresidentUpdate}
                    >
                      अध्यक्ष माहिती अद्ययावत करा
                    </Button>
                  </div>
                  <div className="border rounded-lg p-6">
                    <h3 className="text-xl font-bold text-marathi-orange mb-4">सचिव माहिती</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <Input
                          placeholder="सचिवाचे नाव"
                          value={editingSecretary.name}
                          onChange={e => setEditingSecretary({ ...editingSecretary, name: e.target.value })}
                          className="w-full"
                        />
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            फोटो (वैकल्पिक)
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={e => {
                              const file = e.target.files?.[0] || null;
                              setEditingSecretary({ ...editingSecretary, photo: file });
                            }}
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                          />
                          {editingSecretary.photo_url && (
                            <img
                              src={editingSecretary.photo_url}
                              alt="Secretary"
                              className="rounded-lg mt-2 w-auto max-h-32 max-w-xs object-contain"
                            />
                          )}
                        </div>
                      </div>
                      <div>
                        <Textarea
                          placeholder="सचिवाचा संदेश/माहिती"
                          rows={6}
                          value={editingSecretary.message}
                          onChange={e => setEditingSecretary({ ...editingSecretary, message: e.target.value })}
                          className="w-full"
                        />
                      </div>
                    </div>
                    <Button
                      className="bg-marathi-orange hover:bg-marathi-deepOrange mt-4"
                      onClick={handleSecretaryUpdate}
                    >
                      सचिव माहिती अद्ययावत करा
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default AdminPanel;
