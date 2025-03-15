'use client'
import React, { type SyntheticEvent, useEffect, useState, useRef } from 'react'
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  type Crop,
  type PixelCrop,
} from 'react-image-crop'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import 'react-image-crop/dist/ReactCrop.css'
import { CropIcon, Trash2Icon } from 'lucide-react'
import { DialogTitle } from '@radix-ui/react-dialog'
import Image from 'next/image'

interface ImageCropperProps {
  value: string | undefined // Base64 da imagem cortada
  onChange: (base64: string | undefined) => void // Função para atualizar o base64
  children: React.ReactNode // Componente filho que abre o seletor de arquivo
  aspectRatio?: number
}

export function ImageCropper({
  onChange,
  aspectRatio = undefined,
  children,
}: ImageCropperProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [crop, setCrop] = useState<Crop>()
  const [croppedImageUrl, setCroppedImageUrl] = useState<string>('')
  const [fileUrl, setFileUrl] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imgRef = useRef<HTMLImageElement>(null) // Referência para a imagem

  // Gera a URL temporária apenas uma vez quando o arquivo é selecionado
  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile)
      setFileUrl(url)
      return () => URL.revokeObjectURL(url) // Limpa a URL quando o componente é desmontado
    }
  }, [selectedFile])

  // Função para cortar a imagem
  function onImageLoad(e: SyntheticEvent<HTMLImageElement>) {
    if (selectedFile) {
      const { width, height } = e.currentTarget
      setCrop(centerAspectCrop(width, height, aspectRatio || 1)) // Aspect ratio 1:1
    }
  }

  function onCropComplete(crop: PixelCrop) {
    if (imgRef.current && crop.width && crop.height) {
      // Limite as dimensões do corte para dentro da imagem
      const constrainedCrop = {
        ...crop,
        x: Math.max(0, Math.min(crop.x, imgRef.current.width - crop.width)),
        y: Math.max(0, Math.min(crop.y, imgRef.current.height - crop.height)),
      }

      const croppedImageUrl = getCroppedImg(imgRef.current, constrainedCrop)
      setCroppedImageUrl(croppedImageUrl)
    }
  }

  function getCroppedImg(image: HTMLImageElement, crop: PixelCrop): string {
    const canvas = document.createElement('canvas')
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height

    canvas.width = crop.width * scaleX
    canvas.height = crop.height * scaleY

    const ctx = canvas.getContext('2d')

    if (ctx) {
      ctx.imageSmoothingEnabled = false

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width * scaleX,
        crop.height * scaleY,
      )
    }

    return canvas.toDataURL('image/png', 1.0)
  }

  // Função para finalizar o corte
  async function onCrop() {
    try {
      if (croppedImageUrl) {
        onChange(croppedImageUrl) // Retorna o base64 da imagem cortada
        setDialogOpen(false) // Fecha o dialog
      }
    } catch (error) {
      console.error('Erro ao cortar a imagem:', error)
      alert('Something went wrong!')
    }
  }

  function handleClear() {
    setSelectedFile(null)
    setDialogOpen(false)
    onChange(undefined)
  }

  return (
    <>
      {/* Input de arquivo oculto */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) {
            setSelectedFile(file)
            setDialogOpen(true) // Abre o dialog para cortar a imagem
          }
        }}
      />

      {/* DialogTrigger para abrir o dialog */}
      <Dialog
        open={!!(dialogOpen && selectedFile)}
        onOpenChange={(open) => {
          console.log('valor de open', open)
          setDialogOpen(open)
        }}
      >
        <DialogTitle></DialogTitle>
        <DialogTrigger asChild>
          <div
            onClick={() => {
              if (!selectedFile) {
                fileInputRef.current!.value = ''
                fileInputRef.current?.click()
              }
            }}
          >
            {children}
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-3xl">
          {selectedFile && ( // Só renderiza o conteúdo do dialog se houver uma imagem selecionada
            <>
              <div className="flex flex-col justify-center gap-2 px-8 pt-8">
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => {
                    // Verifique se 'crop' está definido antes de utilizá-lo
                    console.log('X', percentCrop.x)
                    console.log('Y', percentCrop.y)
                    console.log('width', imgRef.current?.width)
                    console.log('height', imgRef.current?.height)
                    if (crop) {
                      // Limite o valor do crop para garantir que ele não ultrapasse os limites da imagem
                      const constrainedCrop = {
                        ...percentCrop,
                        // x: Garantir que o lado esquerdo do crop não ultrapasse a largura da imagem
                        x: Math.max(
                          0,
                          Math.min(percentCrop.x, 100 - crop.width),
                        ),
                        // y: Garantir que o topo do crop não ultrapasse a altura da imagem
                        y: Math.max(
                          0,
                          Math.min(percentCrop.y, 100 - crop.height),
                        ),
                      }

                      setCrop(constrainedCrop)
                    }
                  }}
                  className="w-full overflow-hidden rounded-sm "
                  onComplete={(c) => onCropComplete(c)}
                  aspect={aspectRatio || undefined}
                >
                  <Image
                    ref={imgRef}
                    src={fileUrl}
                    width={100}
                    height={100}
                    className="w-full h-full"
                    alt=""
                    onLoad={onImageLoad}
                  />
                  {/* <Avatar className="w-full">
                    <AvatarImage
                      ref={imgRef}
                      className=" bg-purple-500"
                      alt="Image Cropper Shell"
                      src={fileUrl}
                      onLoad={onImageLoad}
                    />
                    <AvatarFallback className="size-full min-h-[460px] rounded-none">
                      Loading...
                    </AvatarFallback>
                  </Avatar> */}
                </ReactCrop>
              </div>
              <DialogFooter className="p-6 pt-0 justify-center">
                <DialogClose asChild>
                  <Button
                    size={'sm'}
                    type="reset"
                    className="w-fit"
                    variant={'outline'}
                    onClick={handleClear}
                  >
                    <Trash2Icon className="mr-1.5 size-4" />
                    Cancelar
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  size={'sm'}
                  className="w-fit"
                  onClick={onCrop}
                >
                  <CropIcon className="mr-1.5 size-4" />
                  Cortar
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

// Helper function to center the crop
function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
): Crop {
  // Calcula o lado do crop com base na dimensão maior (para evitar distorção)
  const size = Math.min(mediaWidth, mediaHeight)

  // Garante que o crop não ultrapasse os limites da imagem
  const maxCropX = mediaWidth - size
  const maxCropY = mediaHeight - size

  // Retorna um crop centralizado, mas restringido para não ultrapassar os limites da imagem
  const crop = centerCrop(
    makeAspectCrop(
      {
        unit: 'px',
        width: size,
        height: size, // Garante que o crop seja quadrado
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  )

  // Ajusta o valor do x e y para garantir que o corte não ultrapasse os limites
  crop.x = Math.min(crop.x, maxCropX)
  crop.y = Math.min(crop.y, maxCropY)

  return crop
}
