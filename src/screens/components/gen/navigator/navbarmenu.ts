import { faChartColumn, faCogs, faEnvelope, faList, faListCheck, faListUl, faLocationDot, faSpaghettiMonsterFlying, faTriangleExclamation, faUser } from "@fortawesome/free-solid-svg-icons";

const Navbarmenu = [
    {
        id: 1,
        title: 'Submissions',
        path: '/admin/submissions',
        icon: faListCheck,
    },
    {
        id: 2,
        title: 'Web Control',
        path: '/admin/control',
        icon: faCogs
    },
    {
        id: 3,
        title: 'Form',
        path: '/forms',
        icon: faListUl
    },
]

export default Navbarmenu;