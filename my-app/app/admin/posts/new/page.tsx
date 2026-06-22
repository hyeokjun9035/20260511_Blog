"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import AdminLayout from "../../../../components/layout/AdminLayout"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import Image from "@tiptap/extension-image"
import Placeholder from "@tiptap/extension-placeholder"
import LinkExtension from "@tiptap/extension-link"

import { TextStyle } from "@tiptap/extension-text-style"
import { Color } from "@tiptap/extension-color"
import { FontFamily } from "@tiptap/extension-font-family"

import { Extension } from "@tiptap/core"

import {
    Box,
    Button,
    Divider,
    FormControlLabel,
    IconButton,
    MenuItem,
    Stack,
    Switch,
    TextField,
} from "@mui/material"

import FormatBoldIcon from "@mui/icons-material/FormatBold"
import FormatItalicIcon from "@mui/icons-material/FormatItalic"
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined"
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto"
import LinkIcon from "@mui/icons-material/Link"
import FormatQuoteIcon from "@mui/icons-material/FormatQuote"
import TitleIcon from "@mui/icons-material/Title"



const fontFamilies = [
    {
        label: "Pretendard",
        value:
            "'Pretendard', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
    },
    { label: "Arial", value: "Arial, Helvetica, sans-serif" },
    { label: "Georgia", value: "Georgia, serif" },
    { label: "Courier New", value: "'Courier New', Courier, monospace" },
    { label: "Times New Roman", value: "'Times New Roman', Times, serif" },
]

const fontSizes = [
    "14px",
    "16px",
    "18px",
    "20px",
    "24px",
    "32px",
]

const FontSize = Extension.create({
    name: "fontSize",

    addGlobalAttributes() {
        return [
            {
                types: ["textStyle"],
                attributes: {
                    fontSize: {
                        default: null,
                        parseHTML: (element) => element.style.fontSize,
                        renderHTML: (attributes) => {
                            if (!attributes.fontSize) {
                                return {}
                            }

                            return {
                                style: `font-size: ${attributes.fontSize}`,
                            }
                        },
                    },
                },
            },
        ]
    },

    addCommands() {
        return {
            setFontSize: (fontSize: string) => ({ chain }: any) => {
                return chain().setMark("textStyle", { fontSize }).run()
            },

            unsetFontSize: () => ({ chain }: any) => {
                return chain().setMark("textStyle", { fontSize: null }).run()
            },
        } as any
    },
})

export default function AdminCreatePostPage() {

    type Category = {
        id: number
        parent_id: number | null
        name: string
    }
    const [title, setTitle] = useState("")
    const [published, setPublished] = useState(false)

    const [categories, setCategories] = useState<Category[]>([])
    const [parentCategory, setParentCategory] = useState("")
    const [categoryId, setCategoryId] = useState<number | null>(null)

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`)
            .then(res => res.json())
            .then(data => setCategories(data))
    }, [])

    const parentCategories =
        categories.filter(
            item => item.parent_id === null
        )

    const childCategories = categories.filter(
        item => item.parent_id === Number(parentCategory)
    )

    const editor = useEditor({
        immediatelyRender: false,

        extensions: [
            StarterKit,

            Underline,

            Image,

            TextStyle,

            Color.configure({
                types: ["textStyle"],
            }),

            FontFamily.configure({
                types: ["textStyle"],
            }),

            FontSize,

            LinkExtension.configure({
                openOnClick: false,
            }),

            Placeholder.configure({
                placeholder: "내용을 입력하세요.",
            }),
        ],

        content: "",

        editorProps: {
            attributes: {
                class: "tiptap-editor",
            },
        },
    })

    const uploadImage = async (
        file: File,
    ) => {
        const formData =
            new FormData();

        formData.append(
            "file",
            file,
        );

        const token =
            getCookie("token");

        const response =
            await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/upload/image`,
                {
                    method: "POST",

                    headers: {
                        ...(token
                            ? {
                                Authorization:
                                    `Bearer ${token}`,
                            }
                            : {}),
                    },

                    body: formData,
                },
            );

        if (!response.ok) {
            throw new Error(
                "이미지 업로드 실패",
            );
        }

        return response.json();
    };

    const addImage = () => {
        const input =
            document.createElement(
                "input",
            );

        input.type = "file";
        input.accept = "image/*";

        input.onchange =
            async () => {
                const file =
                    input.files?.[0];

                if (!file) return;

                try {
                    const result =
                        await uploadImage(
                            file,
                        );

                    editor
                        ?.chain()
                        .focus()
                        .setImage({
                            src:
                                result.imageUrl,
                        })
                        .run();
                } catch (error) {
                    console.error(error);

                    alert(
                        "이미지 업로드 실패",
                    );
                }
            };

        input.click();
    };

    const addLink = () => {
        const url = window.prompt(
            "링크 URL 입력",
            "https://"
        )

        if (!url) return

        editor
            ?.chain()
            .focus()
            .setLink({
                href: url,
            })
            .run()
    }

    const router = useRouter()

    const getCookie = (name: string) => {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
        if (match) return match[2]
        return null
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()

        if (!categoryId) {
            alert("카테고리를 선택해주세요.")
            return
        }

        const content = editor?.getHTML() || ''

        try {
            const token = getCookie('token')

            console.log("title :", title);
            console.log("content :", content);
            console.log("typeof :", typeof content);

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                    category_id: categoryId,
                    title,
                    contents: content,
                    thumbnail: '',
                    author_id: null,
                    status: published
                        ? 'PUBLISHED'
                        : 'DRAFT',
                }),
            })

            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.message || '게시글 등록에 실패했습니다.')
            }

            const data = await res.json()
            // Redirect to admin page or to the new post page
            router.push('/admin')
        } catch (err: any) {
            console.error(err)
            alert(err.message || '게시글 등록 중 오류가 발생했습니다.')
        }
    }

    if (!editor) return null

    return (
        <AdminLayout title={["게시글 작성"]}>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "800px",
                    minHeight: 0,
                    gap: 2,
                }}
            >
                {/* Title & Category */}
                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                    <TextField
                        sx={{ width: "1000px" }}
                        label="게시글 제목"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <TextField
                        select
                        sx={{ width: "180px" }}
                        label="대분류"
                        value={parentCategory}
                        onChange={(e) => {
                            setParentCategory(e.target.value)
                            setCategoryId(null)
                        }}
                    >
                        {parentCategories.map((category: Category) => (
                            <MenuItem
                                key={category.id}
                                value={category.id}
                            >
                                {category.name}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        select
                        sx={{ width: "180px" }}
                        label="소분류"
                        value={categoryId ?? ""}
                        onChange={(e) =>
                            setCategoryId(Number(e.target.value))
                        }
                    >
                        {childCategories.map(category => (
                            <MenuItem
                                key={category.id}
                                value={category.id}
                            >
                                {category.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Stack>

                {/* Editor Container */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        flex: 1,
                        minHeight: 0,
                        minWidth: 0,
                        border: "1px solid #e2e8f0",
                        borderRadius: 1,
                        overflow: "hidden",
                        bgcolor: "#fff",
                    }}
                >
                    {/* Toolbar */}
                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                            p: 1.5,
                            borderBottom: "1px solid #e5e7eb",
                            flexWrap: "wrap",
                            bgcolor: "#fafafa",
                        }}
                    >
                        <IconButton
                            onClick={() =>
                                editor.chain().focus().toggleBold().run()
                            }
                            color={
                                editor.isActive("bold")
                                    ? "primary"
                                    : "default"
                            }
                        >
                            <FormatBoldIcon />
                        </IconButton>

                        <IconButton
                            onClick={() =>
                                editor.chain().focus().toggleItalic().run()
                            }
                            color={
                                editor.isActive("italic")
                                    ? "primary"
                                    : "default"
                            }
                        >
                            <FormatItalicIcon />
                        </IconButton>

                        <IconButton
                            onClick={() =>
                                editor
                                    .chain()
                                    .focus()
                                    .toggleUnderline()
                                    .run()
                            }
                            color={
                                editor.isActive("underline")
                                    ? "primary"
                                    : "default"
                            }
                        >
                            <FormatUnderlinedIcon />
                        </IconButton>

                        <Divider orientation="vertical" flexItem />

                        <IconButton
                            onClick={() =>
                                editor
                                    .chain()
                                    .focus()
                                    .toggleHeading({ level: 1 })
                                    .run()
                            }
                            color={
                                editor.isActive("heading", {
                                    level: 1,
                                })
                                    ? "primary"
                                    : "default"
                            }
                        >
                            <TitleIcon />
                        </IconButton>

                        <IconButton
                            onClick={() =>
                                editor
                                    .chain()
                                    .focus()
                                    .toggleBlockquote()
                                    .run()
                            }
                            color={
                                editor.isActive("blockquote")
                                    ? "primary"
                                    : "default"
                            }
                        >
                            <FormatQuoteIcon />
                        </IconButton>

                        <Divider orientation="vertical" flexItem />

                        <IconButton
                            onClick={addLink}
                            color={
                                editor.isActive("link")
                                    ? "primary"
                                    : "default"
                            }
                        >
                            <LinkIcon />
                        </IconButton>

                        <IconButton onClick={addImage}>
                            <InsertPhotoIcon />
                        </IconButton>

                        <TextField
                            select
                            size="small"
                            defaultValue={fontFamilies[0].value}
                            sx={{ width: 180, ml: 2 }}
                            onChange={(e) =>
                                editor
                                    .chain()
                                    .focus()
                                    .setMark("textStyle", {
                                        fontFamily: e.target.value,
                                    })
                                    .run()
                            }
                        >
                            {fontFamilies.map((font) => (
                                <MenuItem
                                    key={font.label}
                                    value={font.value}
                                    sx={{ fontFamily: font.value }}
                                >
                                    {font.label}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            select
                            size="small"
                            defaultValue="16px"
                            sx={{ width: 100 }}
                            onChange={(e) =>
                                editor
                                    .chain()
                                    .focus()
                                    .setMark("textStyle", {
                                        fontSize: e.target.value,
                                    })
                                    .run()
                            }
                        >
                            {fontSizes.map((size) => (
                                <MenuItem key={size} value={size}>
                                    {size}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Stack>

                    {/* Editor Content Area with Scroll */}
                    <Box
                        sx={{
                            flex: 1,
                            minHeight: 0,
                            overflow: "auto",
                            p: 3,
                            width: "100%",
                            "& .tiptap-editor": {
                                outline: "none",
                                lineHeight: 1,
                                fontSize: "16px",
                                fontFamily: "'Pretendard', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto",
                                width: "100%",
                                maxWidth: "100%",
                                overflowWrap: "break-word",
                                wordBreak: "break-word",
                                whiteSpace: "pre-wrap",
                            },
                            "& .tiptap-editor p": {
                                marginTop: 0,
                                marginBottom: 0,
                            },
                            "& .tiptap-editor h1": {
                                fontSize: "2rem",
                                fontWeight: 800,
                                margin: "24px 0",
                            },
                            "& .tiptap-editor blockquote": {
                                borderLeft: "4px solid #1976d2",
                                paddingLeft: "16px",
                                color: "#666",
                                margin: "20px 0",
                            },
                            "& .tiptap-editor img": {
                                maxWidth: "100%",
                                borderRadius: "12px",
                                margin: "16px 0",
                            },
                            "& .tiptap-editor a": {
                                color: "#1976d2",
                                textDecoration: "underline",
                            },
                            "& .ProseMirror-focused": {
                                outline: "none",
                            },
                            "& p.is-editor-empty:first-of-type::before": {
                                content: '"내용을 입력하세요."',
                                color: "#9ca3af",
                                pointerEvents: "none",
                                float: "left",
                                height: 0,
                            },
                        }}
                    >
                        <EditorContent editor={editor} />
                    </Box>
                </Box>

                {/* Footer Actions */}
                <Stack spacing={2}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={published}
                                onChange={(e) =>
                                    setPublished(
                                        e.target.checked
                                    )
                                }
                            />
                        }
                        label="즉시 공개"
                    />
                    <Stack direction="row" spacing={2}>
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                        >
                            등록
                        </Button>
                        <Button
                            component={Link}
                            href="/admin"
                            variant="outlined"
                            size="large"
                        >
                            취소
                        </Button>
                    </Stack>
                </Stack>
            </Box>
        </AdminLayout>
    )
}