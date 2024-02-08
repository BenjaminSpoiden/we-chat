import { buttonVariants } from "@/components/Button"
import { Login } from "@/components/Login"
import { cn } from "@/lib/utils"
import Link from "next/link"

type LoginPageProps = {}

const LoginPage: React.FC<LoginPageProps> = () => {

    return (
        <div className="absolute inset-0">
            <div className="h-full max-w-2xl mx-auto flex flex-col items-center justify-center gap-20">
                <Link href="/" className={cn(buttonVariants({  variant: 'ghost' }), 'self-start -mt-20')}>
                    Home
                </Link>

                <Login />
            </div>
        </div>
    )
}

export default LoginPage