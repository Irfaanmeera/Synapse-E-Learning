import React from "react";

// Define the types
interface ProductType {
  id: number;
  section: string;
  link: string[];
}

interface SocialLinks {
  imgSrc: string;
  link: string;
  width: number;
}

// Social links data
const socialLinks: SocialLinks[] = [
  {
    imgSrc: "/assets/footer/facebook.svg",
    link: "https://www.facebook.com",
    width: 10,
  },
  {
    imgSrc: "/assets/footer/insta.svg",
    link: "https://www.instagram.com",
    width: 14,
  },
  {
    imgSrc: "/assets/footer/twitter.svg",
    link: "https://www.twitter.com",
    width: 14,
  },
];

// Products data
const products: ProductType[] = [
  {
    id: 1,
    section: "Company",
    link: ["About", "Careers", "Mobile", "Blog", "How we work?"],
  },
  {
    id: 2,
    section: "Contact",
    link: ["Help/FAQ", "Press", "Affiliates", "Hotel owners", "Partners"],
  },
  {
    id: 3,
    section: "More",
    link: [
      "Airline fees",
      "Airlines",
      "Low fare tips",
      "Badges &",
      "Certificates",
    ],
  },
];

const Footer = () => {
  return (
    <div className="mx-auto max-w-2xl sm:pt-24 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
      <div className="my-12 grid grid-cols-1 gap-y-10 sm:grid-cols-6 lg:grid-cols-12">
        {/* COLUMN-1 */}
        <div className="sm:col-span-6 lg:col-span-5">
          <div className="flex flex-shrink-0 items-center border-right">
            <img
              src="/assets/logo/Modern_Educational_Logo_Template_-removebg-preview (1).png"
              alt="logo"
              width={314}
              height={96}
            />
          </div>
          <h3 className="text-xs font-medium text-gunmetalgray lh-160 mt-5 mb-4 lg:mb-16">
            Open an account in minutes, get full financial <br /> control for
            much longer.
          </h3>
          <div className="flex gap-4">
            {socialLinks.map((item, i) => (
              <a
                href={item.link}
                key={i}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="bg-white h-12 w-12 shadow-xl text-base rounded-full flex items-center justify-center footer-icons hover:bg-ultramarine">
                  <img
                    src={item.imgSrc}
                    alt={item.imgSrc}
                    width={item.width}
                    height={2}
                    className="sepiaa"
                  />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* COLUMN-2/3/4 */}
        {products.map((product) => (
          <div key={product.id} className="sm:col-span-2">
            <p className="text-black text-lg font-medium mb-9">
              {product.section}
            </p>
            <ul>
              {product.link.map((link, index) => (
                <li key={index} className="mb-5">
                  <a
                    href="/"
                    className="text-darkgray text-base font-normal mb-6 space-links"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* All Rights Reserved */}
      <div className="py-10 md:flex items-center justify-between border-t border-t-gray-blue">
        <h4 className="text-dark-red opacity-75 text-sm text-center md:text-start font-normal">
          @2023. E-learnings. All rights reserved
        </h4>
        <div className="flex gap-5 mt-5 md:mt-0 justify-center md:justify-start">
          <h4 className="text-dark-red opacity-75 text-sm font-normal">
            <a href="/" target="_blank" rel="noopener noreferrer">
              Privacy policy
            </a>
          </h4>
          <div className="h-5 bg-dark-red opacity-25 w-0.5"></div>
          <h4 className="text-dark-red opacity-75 text-sm font-normal">
            <a href="/" target="_blank" rel="noopener noreferrer">
              Terms & conditions
            </a>
          </h4>
        </div>
      </div>
    </div>
  );
};

export default Footer;
