import React from "react";
import "./PricingPage.css";

const plans = [
  {
    name: "Basic",
    price: "₹99",
    period: "/day",
    features: ["1 Service", "Standard Support", "No Add-ons"],
  },
  {
    name: "Standard",
    price: "₹180",
    period: "/day",
    features: ["3 Services", "Priority Support", "1 Free Add-on"],
  },
  {
    name: "Premium",
    price: "₹299",
    period: "/day",
    features: ["Unlimited Services", "24/7 Support", "All Add-ons Included"],
  },
];

export default function PricingPage() {
  return (
    <div className="pricing-page-container">
      <h2 className="pricing-title">Choose Your Plan</h2>
      <div className="pricing-grid">
        {plans.map((plan) => (
          <div className="pricing-card" key={plan.name}>
            <h3>{plan.name}</h3>
            <div className="price">
              {plan.price}
              <span className="price-period">{plan.period}</span>
            </div>
            <ul>
              {plan.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <button className="choose-plan-btn">Select</button>
          </div>
        ))}
      </div>
    </div>
  );
}