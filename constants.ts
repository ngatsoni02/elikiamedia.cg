import { Article, Settings } from './types';

export const INITIAL_ARTICLES: Omit<Article, 'id' | 'date'>[] = [
    {
        title: "Sommet des chefs d'État africains à Addis-Abeba",
        category: "Politique",
        author: "Jean Kabasele",
        media: {
            type: "image",
            url: "https://picsum.photos/800/600?random=1"
        },
        content: "<p>Les dirigeants africains se réunissent pour discuter de l'intégration régionale et des défis sécuritaires du continent. Cette rencontre historique vise à renforcer la coopération entre les nations africaines et à trouver des solutions communes aux problèmes de sécurité qui affectent le développement du continent.</p><h2 class='text-primary-dark font-bold text-2xl my-4'>Un avenir prometteur</h2><p>Le plan de développement économique présenté lors du sommet a été accueilli avec enthousiasme par la plupart des participants. Plusieurs pays ont déjà annoncé leur intention de participer activement à ce projet ambitieux.</p>",
        featured: true
    },
    {
        title: "Croissance économique en hausse de 5,2% en Afrique subsaharienne",
        category: "Économie",
        author: "Marie-Louise Diallo",
        media: {
            type: "image",
            url: "https://picsum.photos/800/600?random=2"
        },
        content: "<p>Malgré les défis mondiaux, la région affiche une résilience remarquable selon le FMI. Les projections économiques montrent une croissance soutenue dans plusieurs secteurs clés, notamment les technologies, l'agriculture et les industries extractives, contribuant ainsi au développement économique de la région.</p><h2 class='text-primary-dark font-bold text-2xl my-4'>Les secteurs porteurs</h2><p>L'analyse détaillée montre que le secteur technologique connaît une croissance exponentielle, avec une augmentation de 12% des investissements dans les startups africaines. L'agriculture moderne et les énergies renouvelables sont également des moteurs importants de cette croissance.</p>",
        featured: true
    },
    {
        title: "Festival panafricain de cinéma : les lauréats dévoilés",
        category: "Culture",
        author: "Samuel N'diaye",
        media: {
            type: "video",
            url: "https://www.youtube.com/embed/dQw4w9WgXcQ"
        },
        content: "<p>Le cinéma africain célébré lors de la 15ème édition du festival qui s'est tenu à Ouagadougou. Des réalisateurs talentueux de tout le continent ont présenté leurs œuvres, mettant en lumière la diversité culturelle et les histoires captivantes de l'Afrique contemporaine.</p><h2 class='text-primary-dark font-bold text-2xl my-4'>Des œuvres remarquables</h2><p>Le grand prix du festival a été décerné au film congolais 'Lumière sur Kin' qui raconte l'histoire touchante d'une famille à travers trois générations. Le film sénégalais 'Teranga' a remporté le prix du public pour sa représentation authentique de la vie rurale.</p>",
        featured: false
    },
    {
        title: "Rapport économique annuel 2025",
        category: "Économie",
        author: "Ministère de l'Économie",
        media: {
            type: "pdf",
            url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", // Dummy PDF for display
            filename: "rapport-economique-2025.pdf"
        },
        content: "<p>Le ministère de l'Économie a publié son rapport annuel sur la situation économique du pays. Ce document complet analyse les performances des différents secteurs et présente les perspectives pour l'année à venir.</p><h2 class='text-primary-dark font-bold text-2xl my-4'>Principales conclusions</h2><p>Le rapport met en lumière une croissance soutenue du PIB de 5,2%, une inflation maîtrisée à 3,8% et une augmentation des investissements étrangers de 12% par rapport à l'année précédente.</p>",
        featured: false
    }
];

export const INITIAL_SETTINGS: Omit<Settings, 'id'> = {
    facebookUrl: "#",
    whatsappUrl: "#",
    youtubeUrl: "#",
    twitterUrl: "#",
    instagramUrl: "#",
    linkedinUrl: "#",
    email: "contact@elikiamedia.com",
    phone: "+243 81 234 5678",
    address: "Kinshasa, RDC",
    mapUrl: "#",
    hours: "Lun-Ven: 8h-18h",
};

export const CATEGORIES = [
    "Actualités",
    "Politique",
    "Économie",
    "Société",
    "Culture",
    "Tribune Libre",
];

export const ALL_CATEGORIES = "Tous";