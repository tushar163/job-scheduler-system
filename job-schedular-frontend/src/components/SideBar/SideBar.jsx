import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Briefcase } from 'lucide-react';

const Sidebar = ({ isOpen }) => {
    const pathname = usePathname();

    const navItems = [
        {
            name: 'Dashboard',
            href: '/dashboard',
            icon: LayoutDashboard,
        },
        // {
        //     name: 'Jobs',
        //     href: '/jobs',
        //     icon: Briefcase,
        // },
    ];

    const isActive = (href) => pathname === href || pathname.startsWith(href + '/');

    return (
        <aside
            className={`${isOpen ? 'w-64' : 'w-20'
                } bg-white text-primary transition-all duration-300 relative flex flex-col border-r border-slate-700/50`}
        >
            {/* Header */}
            <div className="p-6 flex items-center justify-between border-b border-slate-700/50">
                <h1
                    className={`${isOpen ? 'opacity-100' : 'opacity-0'
                        } text-2xl font-bold bg-primary bg-clip-text text-transparent transition-opacity duration-300 whitespace-nowrap`}
                >
                    Dotix Auto
                </h1>


            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group relative
                ${active
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                                }
              `}
                        >
                            {/* Active Indicator */}
                            {active && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
                            )}

                            <Icon
                                className={`w-5 h-5 ${isOpen ? '' : 'mx-auto'
                                    } transition-transform group-hover:scale-110`}
                            />

                            <span
                                className={`${isOpen ? 'opacity-100' : 'opacity-0 w-0'
                                    } font-medium transition-all duration-300 whitespace-nowrap overflow-hidden`}
                            >
                                {item.name}
                            </span>

                            {/* Tooltip for collapsed state */}
                            {!isOpen && (
                                <div className="absolute left-full ml-2 px-3 py-1.5 bg-slate-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl border border-slate-700">
                                    {item.name}
                                </div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-slate-700/50">
                <div
                    className={`${isOpen ? 'opacity-100' : 'opacity-0'
                        } text-xs text-slate-400 text-center transition-opacity duration-300`}
                >
                    © 2024 Dotix
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;