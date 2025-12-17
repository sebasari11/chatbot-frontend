import { useState } from "react";
import {
    deleteFaissIndex,
    resetFaissIndex,
    createFaissIndex,
} from "@/api/faiss";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import TopBar from "@/components/home/TopBar";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { Button } from "@/components/ui/button";
import Input from "@/components/Input";
import { Database, Trash2, RefreshCw, Plus } from "lucide-react";

export default function FaissPage() {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showResetDialog, setShowResetDialog] = useState(false);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [dimension, setDimension] = useState<string>("384");
    const [isProcessing, setIsProcessing] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleDelete = async () => {
        setIsProcessing(true);
        try {
            const response = await deleteFaissIndex();
            setSuccessMessage(response.data.message);
            setShowDeleteDialog(false);
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (error) {
            console.error("Error al eliminar el índice FAISS:", error);
            alert("Error al eliminar el índice FAISS");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReset = async () => {
        setIsProcessing(true);
        try {
            const dim = parseInt(dimension) || 384;
            const response = await resetFaissIndex({ dimension: dim });
            setSuccessMessage(response.data.message);
            setShowResetDialog(false);
            setDimension("384");
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (error) {
            console.error("Error al resetear el índice FAISS:", error);
            alert("Error al resetear el índice FAISS");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCreate = async () => {
        setIsProcessing(true);
        try {
            const dim = parseInt(dimension) || 384;
            const response = await createFaissIndex({ dimension: dim });
            setSuccessMessage(response.data.message);
            setShowCreateDialog(false);
            setDimension("384");
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (error) {
            console.error("Error al crear el índice FAISS:", error);
            alert("Error al crear el índice FAISS");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <>
            <div className="flex flex-col h-screen">
                <TopBar />
                <div className="p-8 max-w-5xl mx-auto">
                    <h1 className="text-2xl font-bold mb-4">Gestión de Índice FAISS</h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Administra el índice FAISS utilizado para la búsqueda semántica. 
                        Ten cuidado con estas operaciones ya que pueden afectar el funcionamiento del sistema.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button
                            onClick={() => setShowCreateDialog(true)}
                            className="flex items-center justify-center gap-2 p-6 bg-[#a0d7e7] hover:bg-[#8bc5d5] text-black font-semibold rounded-lg transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Crear Índice</span>
                        </button>

                        <button
                            onClick={() => setShowResetDialog(true)}
                            className="flex items-center justify-center gap-2 p-6 bg-[#a0d7e7] hover:bg-[#8bc5d5] text-black font-semibold rounded-lg transition-colors"
                        >
                            <RefreshCw className="w-5 h-5" />
                            <span>Resetear Índice</span>
                        </button>

                        <button
                            onClick={() => setShowDeleteDialog(true)}
                            className="flex items-center justify-center gap-2 p-6 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
                        >
                            <Trash2 className="w-5 h-5" />
                            <span>Eliminar Índice</span>
                        </button>
                    </div>

                    <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="flex items-start gap-3">
                            <Database className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                                    Información sobre el Índice FAISS
                                </h3>
                                <p className="text-sm text-blue-800 dark:text-blue-200">
                                    El índice FAISS almacena los vectores de los recursos procesados para permitir 
                                    búsquedas semánticas rápidas. Las operaciones de eliminación y reseteo eliminarán 
                                    todos los vectores almacenados y requerirán reprocesar los recursos.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar índice FAISS?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción eliminará los archivos físicos del índice FAISS y creará un nuevo índice vacío.
                            Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isProcessing}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} disabled={isProcessing}>
                            {isProcessing ? "Eliminando..." : "Eliminar"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Reset Dialog */}
            <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Resetear índice FAISS</DialogTitle>
                        <DialogDescription>
                            Resetea el índice FAISS existente, eliminando todos los vectores y creando un nuevo índice
                            vacío.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <label className="block text-sm font-medium mb-2">
                            Dimensión del índice (default: 384)
                        </label>
                        <Input
                            type="number"
                            value={dimension}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setDimension(e.target.value)
                            }
                            placeholder="384"
                            min="1"
                            max="4096"
                            disabled={isProcessing}
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowResetDialog(false)}
                            disabled={isProcessing}
                        >
                            Cancelar
                        </Button>
                        <Button onClick={handleReset} disabled={isProcessing}>
                            {isProcessing ? "Reseteando..." : "Resetear"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Create Dialog */}
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Crear índice FAISS</DialogTitle>
                        <DialogDescription>
                            Crea un nuevo índice FAISS vacío. Si ya existe un índice, lo sobrescribirá.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <label className="block text-sm font-medium mb-2">
                            Dimensión del índice (default: 384)
                        </label>
                        <Input
                            type="number"
                            value={dimension}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setDimension(e.target.value)
                            }
                            placeholder="384"
                            min="1"
                            max="4096"
                            disabled={isProcessing}
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowCreateDialog(false)}
                            disabled={isProcessing}
                        >
                            Cancelar
                        </Button>
                        <Button onClick={handleCreate} disabled={isProcessing}>
                            {isProcessing ? "Creando..." : "Crear"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Success Message Dialog */}
            {successMessage && (
                <AlertDialog
                    open={!!successMessage}
                    onOpenChange={(open) => !open && setSuccessMessage(null)}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Operación exitosa</AlertDialogTitle>
                            <AlertDialogDescription>{successMessage}</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogAction onClick={() => setSuccessMessage(null)}>
                                Aceptar
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}

            {isProcessing && <LoadingOverlay />}
        </>
    );
}

