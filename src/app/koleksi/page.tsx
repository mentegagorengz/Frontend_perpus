"use client";

import React from "react";
import "tailwindcss/tailwind.css";
import Breadcrumb from "../../components/Breadcrumb";
import Image from "next/image";

const KoleksiDaringPage: React.FC = () => {
    return (
        <div className="bg-gray-50 min-h-screen py-10">
            <main>
                {/* Breadcrumb */}
                <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
                    <Breadcrumb
                        items={[
                            { label: "Beranda", href: "/" },
                            { label: "Koleksi Daring", href: "/koleksi-daring" },
                        ]}
                    />
                </div>

                {/* Hero Section */}
                {/* <section className="relative w-full h-[400px] mb-12">
                    <Image
                        src="/images/library-hero.jpg"
                        alt="Koleksi Daring Perpustakaan"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg opacity-90"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <h2 className="text-white text-5xl font-bold text-center">
                            Akses Koleksi Daring <br /> untuk Mendukung Studi dan Penelitian Anda
                        </h2>
                    </div>
                </section> */}

                {/* Koleksi Daring */}
                <section id="koleksi-daring" className="py-12">
                    <div className="container mx-auto text-center px-4 sm:px-6 lg:px-8">
                        <h3 className="text-4xl font-extrabold text-[#1f2023] mb-10">
                            Koleksi Daring
                        </h3>

                        {sections.map((section, index) => (
                            <div key={index} className="mb-16">
                                <h4 className="text-2xl font-semibold text-[#1f2023] border-b-4 border-[#B22222] inline-block pb-2 mb-6">
                                    {section.title}
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                                    {section.collections.map((collection, idx) => (
                                        <CollectionCard key={idx} {...collection} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
};

interface CollectionCardProps {
    imgSrc: string;
    imgAlt: string;
    title: string;
    link: string;
}

const CollectionCard: React.FC<CollectionCardProps> = ({ imgSrc, imgAlt, title, link }) => (
    <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 block text-center"
    >
        <div className="relative w-full h-24 flex justify-center items-center">
            <Image
                src={imgSrc}
                alt={imgAlt}
                width={120}
                height={80}
                className="object-contain"
            />
        </div>
        <h4 className="text-lg font-bold text-gray-900 mt-4">{title}</h4>
    </a>
);

const sections = [
    {
        title: "E-Journal Nasional",
        collections: [
            { imgSrc: "/images/e-journal.png", imgAlt: "E-Journal UNSRAT", title: "E-Journal UNSRAT", link: "https://ejournal.unsrat.ac.id/" },
            { imgSrc: "/images/garuda.png", imgAlt: "Garuda Ristekdikti", title: "Garuda", link: "http://garuda.ristekdikti.go.id/" },
            { imgSrc: "/images/neliti.png", imgAlt: "Neliti", title: "Neliti", link: "https://www.neliti.com/id/" },
        ],
    },
    {
        title: "E-Journal Internasional",
        collections: [
            { imgSrc: "/images/ieee-open.png", imgAlt: "IEEE Open Access", title: "IEEE Open", link: "https://open.ieee.org/" },
            { imgSrc: "/images/sciencedirect.png", imgAlt: "Science Direct", title: "Science Direct", link: "https://www.sciencedirect.com/" },
            { imgSrc: "/images/doaj.png", imgAlt: "DOAJ", title: "DOAJ", link: "https://doaj.org/" },
            { imgSrc: "/images/oajse.png", imgAlt: "OAJSE", title: "OAJSE", link: "https://www.kkhsou.in/library/oajse/" },
            { imgSrc: "/images/omics.png", imgAlt: "OMICS", title: "OMICS", link: "https://www.omicsonline.org/" },
            { imgSrc: "/images/arxiv.png", imgAlt: "ArXiv", title: "ArXiv", link: "https://arxiv.org/" },
            { imgSrc: "/images/base.png", imgAlt: "BASE", title: "BASE", link: "https://www.base-search.net/" },
            { imgSrc: "/images/core.png", imgAlt: "CORE", title: "CORE", link: "https://core.ac.uk/" },
            { imgSrc: "/images/tfo_logo.png", imgAlt: "Taylor & Francis", title: "Taylor & Francis", link: "https://www.tandfonline.com/" },
        ],
    },
    {
        title: "Buku Elektronik (E-Book)",
        collections: [
            { imgSrc: "/images/wiley.png", imgAlt: "Wiley Online Library", title: "Wiley Online Library", link: "https://olabout.wiley.com/WileyCDA/Section/id-829579.html" },
            { imgSrc: "/images/oxford.png", imgAlt: "Oxford Books", title: "Oxford Books", link: "http://www.oxfordscholarship.com/" },
            { imgSrc: "/images/springer-link.png", imgAlt: "Springer Link", title: "Springer Link", link: "https://link.springer.com/" },
            { imgSrc: "/images/onesearch.png", imgAlt: "OneSearch", title: "OneSearch", link: "https://onesearch.id/" },
            { imgSrc: "/images/perpusnas.png", imgAlt: "Perpusnas", title: "Perpusnas", link: "https://e-resources.perpusnas.go.id/" },
        ],
    },
];

export default KoleksiDaringPage;
