import Link from "next/link";
import Image from "next/image";
import { SearchInput } from "./search-input";
import { UserButton, OrganizationSwitcher } from "@clerk/nextjs";

export const Navbar = () => {
    return (
        <nav className="flex items-center justify-between h-full w-full">
            <div className="flex items-center gap-2 shrink-0 pr-6">
                <Link href="/">
                    <Image
                        src="/simdocsLogo.png"
                        alt="Logo"
                        width={36}
                        height={36}
                    />
                </Link>
                <h3 className="text-blue-500 text-xl">SimDocs</h3>
            </div>
            <SearchInput />
            <div className="flex items-center gap-3 pl-6">
            <OrganizationSwitcher 
                afterCreateOrganizationUrl={"/"}
                afterSelectOrganizationUrl={"/"}
                afterLeaveOrganizationUrl={"/"}
                afterSelectPersonalUrl={"/"}
            />
            <UserButton />
            </div>
            
        </nav>
    );
};