<template>
    <div class="container">
        <el-header>
            <!-- Title similar to file_encrypt.vue -->
            <div class="title">{{ $t ? $t('imageToPdf.title') : 'Image to PDF Converter' }}</div>
        </el-header>
        <el-main>
            <!-- Use el-form for structure consistency -->
            <el-form label-position="top">
                <el-form-item :label="$t ? $t('imageToPdf.uploadImages') : 'Upload Images'">
                    <!-- Keep picture-card for image preview, but inside a form item -->
                    <el-upload v-model:file-list="fileList" list-type="picture-card" :auto-upload="false"
                        :on-change="handleFileChange" :on-remove="handleFileRemove" multiple accept="image/*"
                        class="image-upload">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        <!-- Optional: Add text like in file_encrypt -->
                        <!-- <div class="el-upload__text">
                             <em>{{ $t ? $t('imageToPdf.dragOrClick') : 'Click or drag images here' }}</em>
                         </div> -->
                    </el-upload>
                </el-form-item>

                <el-form-item>
                    <!-- Apply similar button styling -->
                    <el-button type="primary" class="convert-btn" @click="generatePDF"
                        :disabled="fileList.length === 0 || isProcessing" :loading="isProcessing" icon="Document">
                        {{ $t ? $t('imageToPdf.convertToPdf') : 'Convert to PDF' }}
                    </el-button>
                </el-form-item>
                <!-- Display download link when PDF is ready -->
                <el-form-item v-if="pdfUrl">
                    <div class="pdflink">
                        <el-link type="primary" :href="pdfUrl" target="_blank" rel="noopener noreferrer">
                            <el-icon>
                                <View />
                            </el-icon> <!-- Changed icon to View for better semantics -->
                            {{ $t ? $t('imageToPdf.viewPdf') : 'View PDF' }}: {{ pdfFileName }}
                        </el-link>

                        <el-link type="primary" :href="pdfUrl" :download="pdfFileName">
                            <el-icon>
                                <Link />
                            </el-icon> {{ $t ? $t('imageToPdf.downloadPdf') : 'Download PDF' }}: {{ pdfFileName }}
                        </el-link>
                    </div>
                </el-form-item>
            </el-form>
        </el-main>
    </div>
</template>

<script setup>
import { ref, onUnmounted } from "vue";
import { ElMessage } from "element-plus";
import jsPDF from "jspdf";
import { Plus, Document, Link } from '@element-plus/icons-vue'; // Import icons

// --- Reactive State ---
const fileList = ref([]); // Use v-model:file-list with el-upload
const isProcessing = ref(false);
const pdfUrl = ref(''); // To store the generated PDF blob URL
const pdfFileName = ref('merged_images.pdf'); // Default filename

// Store raw files separately if needed for processing, el-upload's fileList contains UploadFile objects
const rawFiles = ref([]);

// --- Methods ---
const handleFileChange = (uploadFile, uploadFiles) => {
    // Validate file type on change
    if (uploadFile.raw && !uploadFile.raw.type.startsWith("image/")) {
        ElMessage.error(`${uploadFile.name} is not an image file.`);
        // Remove invalid file from list
        fileList.value = fileList.value.filter(f => f.uid !== uploadFile.uid);
        return;
    }
    // Update rawFiles list
    rawFiles.value = uploadFiles.map(f => f.raw).filter(Boolean); // Filter out potential undefined raw files

    // Clear previous PDF link if new files are added/changed
    if (pdfUrl.value) {
        URL.revokeObjectURL(pdfUrl.value);
        pdfUrl.value = '';
    }
};

const handleFileRemove = (uploadFile, uploadFiles) => {
    // Update rawFiles list
    rawFiles.value = uploadFiles.map(f => f.raw).filter(Boolean);
    // Clear previous PDF link if files are removed
    if (pdfUrl.value) {
        URL.revokeObjectURL(pdfUrl.value);
        pdfUrl.value = '';
    }
};

// Image compression utility (optional, but good for performance)
const compressImage = (img, maxWidth, maxHeight, quality = 0.7) => {
    return new Promise((resolve) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        let { width, height } = img;

        // Calculate scaling
        if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width *= ratio;
            height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // Get blob with specified quality
        canvas.toBlob((blob) => resolve(blob), "image/jpeg", quality);
    });
};

const generatePDF = async () => {
    if (rawFiles.value.length === 0) {
        ElMessage.warning($t ? $t('imageToPdf.warningNoImages') : "Please upload at least one image.");
        return;
    }

    isProcessing.value = true;
    // Clear previous PDF URL if regenerating
    if (pdfUrl.value) {
        URL.revokeObjectURL(pdfUrl.value);
        pdfUrl.value = '';
    }

    try {
        // Initialize jsPDF. 'p' for portrait, 'mm' for millimeters, 'a4' for size.
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        for (let i = 0; i < rawFiles.value.length; i++) {
            const file = rawFiles.value[i];
            const img = new Image();
            img.src = URL.createObjectURL(file); // Use object URL from raw file

            await new Promise((resolve, reject) => {
                img.onload = async () => {
                    try {
                        // Optional: Compress image before adding to PDF
                        // Adjust maxWidth/maxHeight as needed, potentially based on PDF page size
                        const compressedBlob = await compressImage(img, pdfWidth * 3, pdfHeight * 3, 0.7); // Higher res for better quality PDF
                        const reader = new FileReader();

                        reader.readAsDataURL(compressedBlob);
                        reader.onloadend = () => {
                            const compressedImgDataUrl = reader.result;
                            const imgProps = pdf.getImageProperties(compressedImgDataUrl);

                            // Calculate image dimensions to fit A4 page, maintaining aspect ratio
                            const imgWidth = imgProps.width;
                            const imgHeight = imgProps.height;
                            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

                            const displayWidth = imgWidth * ratio;
                            const displayHeight = imgHeight * ratio;

                            // Center image on page (optional)
                            const x = (pdfWidth - displayWidth) / 2;
                            const y = (pdfHeight - displayHeight) / 2;


                            if (i > 0) pdf.addPage();
                            pdf.addImage(compressedImgDataUrl, "JPEG", x, y, displayWidth, displayHeight);

                            URL.revokeObjectURL(img.src); // Clean up object URL
                            resolve();
                        };
                        reader.onerror = (e) => {
                            URL.revokeObjectURL(img.src);
                            console.error("FileReader error:", e);
                            reject(new Error(`Failed to read compressed image for ${file.name}`));
                        };
                    } catch (compressError) {
                        URL.revokeObjectURL(img.src);
                        console.error("Image compression error:", compressError);
                        reject(new Error(`Failed to compress image ${file.name}`));
                    }
                };
                img.onerror = (e) => {
                    URL.revokeObjectURL(img.src); // Clean up object URL
                    console.error("Image load error:", e);
                    reject(new Error(`Failed to load image ${file.name}`));
                };
            });
        }

        // Generate Blob and create URL, then display link
        const pdfBlob = pdf.output("blob");
        pdfUrl.value = URL.createObjectURL(pdfBlob);
        // pdfFileName.value = `images-${Date.now()}.pdf`; // Optionally create dynamic name
        ElMessage.success($t ? $t('imageToPdf.success') : 'PDF generated successfully. Click the link below to download.');

    } catch (error) {
        console.error("PDF Generation Error:", error);
        ElMessage.error($t ? $t('imageToPdf.error') : `Failed to generate PDF: ${error.message || 'Unknown error'}`);
        // Ensure URL is cleared on error if partially created
        if (pdfUrl.value) {
            URL.revokeObjectURL(pdfUrl.value);
            pdfUrl.value = '';
        }
    } finally {
        isProcessing.value = false;
    }
};

// --- Lifecycle Hooks ---
onUnmounted(() => {
    // Clean up the object URL when the component is destroyed
    if (pdfUrl.value) {
        URL.revokeObjectURL(pdfUrl.value);
    }
    // Clean up image object URLs if necessary (though handled in generatePDF)
    // rawFiles.value.forEach(file => /* check if URL exists and revoke */);
});

// --- i18n Placeholder (replace with your actual i18n setup if you have one) ---
// const $t = (key) => key; // Simple placeholder if not using vue-i18n

</script>

<style scoped>
/* Import styles inspired by file_encrypt.vue */
.container {
    /* Add padding or max-width if needed, similar to file_encrypt's container */
    padding: 20px;
    max-width: 800px;
    /* Example max-width */
    margin: 0 auto;
    /* Center the container */
}

/* Adjust el-form-item margin if needed */
.el-form-item {
    margin-bottom: 25px;
    /* Slightly more space */
}

/* Style the upload area */
.image-upload :deep(.el-upload--picture-card) {
    /* width: 100px; */
    /* height: 100px; */
    /* line-height: 110px; */
}

.image-upload :deep(.el-upload-list--picture-card .el-upload-list__item) {
    /* width: 100px; */
    /* height: 100px; */
}

/* Ensure upload component takes reasonable space */
.image-upload {
    width: 100%;
}


/* Style the convert button similar to encode-btn */
.convert-btn {
    /* Adapt styles from .encode-btn */
    min-width: 150px;
    /* Ensure minimum width */
    background-color: #007aff;
    /* Primary blue */
    border-color: #007aff;
    color: white;
    border-radius: 8px;
    padding: 10px 20px;
    font-size: 16px;
    transition: background-color 0.3s ease, border-color 0.3s ease;
}

.convert-btn:hover:not(:disabled) {
    background-color: #005bb5;
    border-color: #005bb5;
}

/* Add specific disabled styles if needed, though Element Plus handles it */
.convert-btn:disabled {
    /* background-color: #a0cfff; */
    /* border-color: #a0cfff; */
    /* cursor: not-allowed; */
}

/* Style the download link */
.el-link {
    font-size: 16px;
    /* Make link noticeable */
    align-items: center;
    /* Align icon and text */
}

.el-link .el-icon {
    margin-right: 5px;
    /* Space between icon and text */
}

/* Header styling if needed */
.el-header {
    padding: 0;
    /* Remove default padding if using custom title div */
    height: auto;
    /* Adjust height based on content */
    border-bottom: 1px solid #ebeef5;
    /* Optional separator */
    margin-bottom: 20px;
}

/* Ensure main area has padding */
.el-main {
    padding: 20px 0 0 0;
    /* Add padding top, remove others if handled by container */
}

.pdflink {
    display: flex;
    flex-direction: column;
}
</style>

<!-- 
<template>
    <el-container>
        <el-main>
            <h1>Convert many pictures to one pdf file</h1>
            <el-upload list-type="picture-card" :auto-upload="false" :on-change="handleUpload" multiple>
                <el-icon>
                    <Plus />
                </el-icon>
            </el-upload>

            <el-button type="primary" @click="generatePDF" :disabled="fileList.length === 0">
                Convert to PDF
            </el-button>
        </el-main>
    </el-container>
</template>

<script>
import { ref } from "vue";
import { ElMessage } from "element-plus";
import jsPDF from "jspdf";

export default {
    setup() {
        const fileList = ref([]);

        const handleUpload = (file) => {
            if (!file.raw.type.startsWith("image/")) {
                ElMessage.error("Please upload an image file.");
                return false;
            }
            fileList.value.push({ url: URL.createObjectURL(file.raw), name: file.raw.name });
            return false;
        };

        const compressImage = (img, maxWidth, maxHeight) => {
            return new Promise((resolve) => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                let { width, height } = img;

                if (width > maxWidth || height > maxHeight) {
                    const scale = Math.min(maxWidth / width, maxHeight / height);
                    width *= scale;
                    height *= scale;
                }

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);
                canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.7);
            });
        };

        const generatePDF = async () => {
            if (fileList.value.length === 0) {
                ElMessage.warning("Please upload at least one image.");
                return;
            }
            const pdf = new jsPDF();
            for (let i = 0; i < fileList.value.length; i++) {
                const img = new Image();
                img.src = fileList.value[i].url;
                await new Promise((resolve) => {
                    img.onload = async () => {
                        const compressedBlob = await compressImage(img, 600, 800);
                        const reader = new FileReader();
                        reader.readAsDataURL(compressedBlob);
                        reader.onloadend = () => {
                            const compressedImg = reader.result;
                            const imgWidth = 210;
                            const imgHeight = (img.height / img.width) * imgWidth;
                            if (i > 0) pdf.addPage();
                            pdf.addImage(compressedImg, "JPEG", 0, 0, imgWidth, imgHeight);
                            resolve();
                        };
                    };
                });
            }
            const pdfBlob = pdf.output("blob");
            if (pdfBlob.size > 1048576) {
                ElMessage.error("Generated PDF exceeds 1MB. Please try uploading fewer images or lower resolution.");
            } else {
                pdf.save("merged_images.pdf");
            }

            // if (pdf.internal.stream.bytes.length > 1048576) {
            //     ElMessage.error("Generated PDF exceeds 1MB. Please try uploading fewer images or lower resolution.");
            // } else {
            //     pdf.save("merged_images.pdf");
            // }
        };

        return {
            fileList,
            handleUpload,
            generatePDF,
        };
    },
};
</script>
<style scoped>
.el-upload {
    margin-bottom: 20px;
}
</style> -->
