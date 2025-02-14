import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarProvider,
} from '@/components/ui/sidebar';
// import PhotoWall from '@/components/photo-wall'
import { PageProps } from '@/types';

export default function Welcome({
    auth,
    laravelVersion,
    phpVersion,
}: PageProps<{ laravelVersion: string; phpVersion: string }>) {
    const handleImageError = () => {
        document
            .getElementById('screenshot-container')
            ?.classList.add('!hidden');
        document.getElementById('docs-card')?.classList.add('!row-span-1');
        document
            .getElementById('docs-card-content')
            ?.classList.add('!flex-row');
        document.getElementById('background')?.classList.add('!hidden');
    };

    return (
        <SidebarProvider>
            <div className="flex h-screen">
                <Sidebar className="w-1/5">
                    <SidebarHeader className="p-4">
                        <h2 className="text-2xl font-bold">Своя игра</h2>
                    </SidebarHeader>
                    <SidebarContent className="p-4">
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="username">
                                    Имя пользователя
                                </Label>
                                <Input
                                    id="username"
                                    placeholder="Введите имя"
                                />
                            </div>
                            <div>
                                <Label htmlFor="password">Пароль</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Введите пароль"
                                />
                            </div>
                            <Button className="w-full">Войти</Button>
                            <div className="text-center">или</div>
                            <Button variant="outline" className="w-full">
                                Присоединиться к группе
                            </Button>
                        </div>
                    </SidebarContent>
                </Sidebar>
                <main className="flex-1 overflow-hidden">
                    {/*<PhotoWall />*/}
                </main>
            </div>
        </SidebarProvider>
    );
}
