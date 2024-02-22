import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom"
import { LoginPage } from "../auth"
import { CalendarPage } from "../calendar";
import { useAuthStore } from "../hooks";
import { useEffect } from "react";

export const AppRouter = () => {

    const { status, checkAuthToken } = useAuthStore();

    useEffect(() => {
        checkAuthToken();
    }, [])

    if( status === 'checking' ){
        return (
            <h3>Cargando...</h3>
        )
    }

    const router = createBrowserRouter(
        status === 'not-authenticated'?
        [
            {
                path:"/auth/*",
                element: <LoginPage/>
            },
            {
                path:"/*",
                element: <Navigate to="/auth/login"/>
            }
        ]:
        [
            {
                path:"/",
                element: <CalendarPage/>
            },
            {
                path:"/*",
                element: <Navigate to="/"/>
            }
        ]
    )

    return <RouterProvider router={router} />; 
}
