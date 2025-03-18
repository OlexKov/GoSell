import { useEffect, useRef } from "react"
import { useAppDispatch, useAppSelector } from "../../../redux"
import { AdminContent } from "./content"
import { AdminFooter } from "./footer"
import { AdminHeader } from "./header"
import { SideBar } from "./sidebar"
import { resetScroll } from "../../../redux/slices/appSlice"

const AdminLayout: React.FC = () => {
    const scrollToTop = useAppSelector(state => state.app.scroll)
    const containerRef = useRef<HTMLDivElement>(null);
    const dispatcher = useAppDispatch()
    useEffect(() => {
        if (!containerRef.current || !scrollToTop) return;
        containerRef.current?.scrollTo({
            top: 0,
            behavior: "smooth"
        });
        dispatcher(resetScroll())
    }, [scrollToTop])
    return (
        <div className='flex flex-1  h-screen' >
            <SideBar />
            <div ref={containerRef} className='w-full h-full flex flex-col justify-stretch overflow-y-auto' >
                <AdminHeader />
                <AdminContent />
                <AdminFooter />
            </div>
        </div>
    )
}
export default AdminLayout