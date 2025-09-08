

const PrivacyPage = () => {
  const Section = ({ title, children }) => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      {children}
    </div>
  );

  return (
      <main className="flex-grow  bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
            <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="space-y-6">
              <Section title="Introduction">
                <p className="text-gray-600">
                  At Health Sync, we are committed to protecting your health data and personal information. 
                  This Privacy Policy explains how we collect, use, and safeguard your data when you use our health tracking services.
                </p>
              </Section>
              
              <Section title="Information We Collect">
                <p className="text-gray-600">
                  We collect information necessary to provide our health tracking services, including:
                </p>
                <ul className="text-gray-600 list-disc list-inside mt-2 ml-4">
                  <li>Personal details (name, email, age, gender)</li>
                  <li>Health metrics (BMI, blood pressure, heart rate, etc.)</li>
                  <li>Fitness and nutrition data</li>
                  <li>Device information for app functionality</li>
                  <li>Usage data to improve our services</li>
                </ul>
              </Section>
              
              <Section title="How We Use Your Information">
                <p className="text-gray-600">
                  Your information is used to:
                </p>
                <ul className="text-gray-600 list-disc list-inside mt-2 ml-4">
                  <li>Provide personalized health insights and recommendations</li>
                  <li>Track and visualize your health progress over time</li>
                  <li>Improve our services and develop new features</li>
                  <li>Communicate important updates about your health account</li>
                  <li>Ensure the security and proper functioning of our platform</li>
                </ul>
              </Section>
              
              <Section title="Data Security">
                <p className="text-gray-600">
                  We implement industry-standard security measures to protect your sensitive health data, 
                  including encryption, secure servers, and restricted access to personal information. 
                  Your health data is stored securely and never shared without your explicit consent.
                </p>
              </Section>
              
              <Section title="Third-Party Services">
                <p className="text-gray-600">
                  We only use trusted third-party services that comply with health data regulations. 
                  These include payment processors (like Razorpay) and analytics services that help us 
                  improve our platform. We never sell your health data to third parties.
                </p>
              </Section>
              
              <Section title="Your Rights">
                <p className="text-gray-600">
                  You have the right to access, correct, or delete your personal information at any time. 
                  You can also export your health data for your records. Contact us at ravi.sinhmar28@gmail.com 
                  for any privacy-related requests.
                </p>
              </Section>
              
              <Section title="Policy Updates">
                <p className="text-gray-600">
                  We may update this policy periodically to reflect changes in our services or legal requirements. 
                  Continued use of Health Sync constitutes acceptance of the updated policy.
                </p>
              </Section>
            </div>
          </div>
        </div>
      </main>
  
  );
};

export default PrivacyPage;