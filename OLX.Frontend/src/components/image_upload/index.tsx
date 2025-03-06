import React, { forwardRef, useMemo, useRef, useState } from "react";
import { Upload, Image, UploadProps } from "antd";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { FileType } from "../../utilities/common_funct";
import imageCompression from "browser-image-compression";
import { PlusOutlined } from '@ant-design/icons';
import { UploadWithDndProps } from "./props";
import SortableImage from "./sortable_image";


const UploadWithDnd: React.FC<UploadWithDndProps> = forwardRef<HTMLDivElement,UploadWithDndProps>(({ uploadSize, images = [], onChange = () => { },name, className, maxCount = 5, defaultCount = 4, columns = 5, rowHeight = 10 },ref) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const uploadRef = useRef<any>(null);

    const onFilesChange: UploadProps['onChange'] = async ({ fileList: newFileList }) => {
        if (newFileList.length > maxCount) {
            newFileList = newFileList.slice(0, maxCount)
        }

        for (let index = 0; index < newFileList.length; index++) {
            if (!newFileList[index].url && !newFileList[index].thumbUrl) {
                const smallFile = await imageCompression(newFileList[index].originFileObj as FileType, { maxWidthOrHeight: 200 })
                newFileList[index].thumbUrl = URL.createObjectURL(smallFile)
            }
        }
        onChange(newFileList);
    }

    const handlePreview = async (previev: string) => {
        setPreviewImage(previev);
        setPreviewOpen(true);
    };

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (!over || !images.some((item) => item.uid === active.id)) {
            return;
        }

        if (active.id !== over.id) {
            const oldIndex = images.findIndex((item) => item.uid === active.id);
            const newIndex = images.findIndex((item) => item.uid === over.id);
            onChange(arrayMove(images, oldIndex, newIndex));
        }
    };

    const onRemove = (uid: string | undefined) => {
        onChange(images.filter(x => x.uid !== uid));
    }

    const openFileDialog = () => {
        if (uploadRef.current) {
            uploadRef.current?.upload.uploader.fileInput.click();
        }
    };

    const defaultLoaders = useMemo(() => {
        const loaders = images.length < defaultCount
            ? Array.from({ length: defaultCount - images.length }).map((_, index) =>
                <div onClick={openFileDialog} key={index} className={`flex  flex-shrink-0 bg-white items-center cursor-pointer justify-center border border-[#9B7A5B] border-opacity-50 rounded-lg h-[100%] aspect-[16/16] transition-all duration-300 ease-in-out hover:scale-[1.05]`} style={{ width: uploadSize, height: uploadSize }}>
                    <PlusOutlined className="font-montserrat text-[#9B7A5B] text-opacity-50 text-adaptive-advert-page-price-text" />
                </div>)
            : []
        const loader = images.length < maxCount &&
            <div onClick={openFileDialog} className={`flex flex-col flex-shrink-0 gap-0 justify-center cursor-pointer text-center bg-[#9B7A5B] bg-opacity-20 rounded-lg h-[100%] aspect-[16/16] transition-all duration-300 ease-in-out hover:scale-[1.05]`} style={{ width: uploadSize, height: uploadSize }}>
                <span className="font-montserrat  text-adaptive-1_7_text">Додати ще</span>
                <span className="font-montserrat  text-adaptive-1_7_text">фото</span>
            </div>

        return [...loaders, loader]
    }, [images.length, defaultCount, maxCount])

    const uploadedImages = useMemo(() => {
        const newImages = images.length > 0 ? images.map(file =>
            <SortableImage
                onDelete={onRemove}
                onPreview={handlePreview}
                key={file?.uid}
                file={file}
                uploadSize={uploadSize} />) : []

        return [...newImages, ...defaultLoaders]
    }, [images])

    return (
        <div ref={ref}>
            <Upload
                name={name}
                ref={uploadRef}
                fileList={images}
                multiple
                accept=".jpg,.png,.webp,.jpeg"
                onChange={onFilesChange}
                beforeUpload={() => false}
                showUploadList={false}
            />

            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={images.map((file) => file?.uid)}>
                    <div className={`grid  ${className}`} style={{ gridTemplateColumns: `repeat(${columns},${rowHeight}vh)` }}>
                        {...uploadedImages}
                    </div>
                </SortableContext>
            </DndContext >

            {previewImage && (
                <Image
                    wrapperStyle={{ display: 'none' }}
                    preview={{
                        visible: previewOpen,
                        onVisibleChange: (visible) => setPreviewOpen(visible),
                        afterOpenChange: (visible) => !visible && setPreviewImage(''),
                    }}
                    src={previewImage}
                />
            )}

        </div>
    );
});

export default UploadWithDnd;