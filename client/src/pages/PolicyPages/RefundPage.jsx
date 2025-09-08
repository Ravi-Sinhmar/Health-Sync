

const RefundPage = () => {
  const Section = ({ title, children }) => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      {children}
    </div>
  );

  return (

      <main className="flex-grow bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Refund Policy</h1>
            <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="space-y-6">
              <Section title="Subscription Cancellation">
                <p className="text-gray-600">
                  You can cancel your Health Sync subscription at any time through your account settings. 
                  After cancellation, you will continue to have access to premium features until the end of your current billing period.
                </p>
              </Section>
              
              <Section title="Refund Eligibility">
                <p className="text-gray-600">
                  We offer refunds for subscription payments within 14 days of purchase if you are dissatisfied with our service. 
                  To request a refund, please contact our support team at ravi.sinhmar28@gmail.com with your account details 
                  and reason for the refund request.
                </p>
              </Section>
              
              <Section title="Non-Refundable Situations">
                <p className="text-gray-600">
                  Refunds are generally not provided for:
                </p>
                <ul className="text-gray-600 list-disc list-inside mt-2 ml-4">
                  <li>Partial months of service</li>
                  <li>Subscription renewals that weren't canceled in time</li>
                  <li>Accounts that violated our Terms of Service</li>
                  <li>Change of mind after 14 days of subscription</li>
                </ul>
              </Section>
              
              <Section title="Refund Processing">
                <p className="text-gray-600">
                  Approved refunds will be processed within 7-10 business days. The amount will be credited 
                  to your original payment method. Depending on your financial institution, it may take additional 
                  time for the refund to appear on your statement.
                </p>
              </Section>
              
              <Section title="Free Trial">
                <p className="text-gray-600">
                  Health Sync may offer free trials of premium features. If you don't cancel before the trial period ends, 
                  your subscription will automatically convert to a paid plan. You can cancel during the trial period 
                  without being charged.
                </p>
              </Section>
              
              <Section title="Exceptional Circumstances">
                <p className="text-gray-600">
                  In exceptional circumstances such as extended service outages or technical issues that significantly 
                  impact your ability to use Health Sync, we may offer refunds or service credits at our discretion.
                </p>
              </Section>
              
              <Section title="Contact for Refunds">
                <p className="text-gray-600">
                  For refund requests or questions about our refund policy, please contact our support team at 
                  ravi.sinhmar28@gmail.com. Include your account email and details about your request for faster processing.
                </p>
              </Section>
            </div>
          </div>


        </div>
      </main>
    
  );
};

export default RefundPage;