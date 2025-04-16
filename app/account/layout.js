import SideNavigation from "@/app/_components/SideNavigation"

function layout({children}) {
    return (
        <div className="gap-12 grid grid-cols-[16rem_1fr] h-full ">
         <SideNavigation/>
            <div className="py-1"> {children}</div>
        </div>
    )
}

export default layout
