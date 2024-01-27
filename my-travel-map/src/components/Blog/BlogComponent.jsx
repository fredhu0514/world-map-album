import React, { useState, useEffect } from "react";
import { usePathname } from 'next/navigation';

// Get All APIs
const fetchApi = async (url, parameter) => {
    const res = await fetch(url, parameter);
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
};

const BlogComponent = () => {
    const pathname = usePathname();
    const [blog, setBlog] = useState(null);
    const [saveBlog, setSaveBlog] = useState({
        timestamp: "",
        title: "",
        description: ""
    });

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const id = searchParams.get('id');
        const getBlog = async () => {
            const blogData = await fetchApi(
                "http://localhost:3000/api/blogs?id=" + id
            );
            setBlog(blogData.blog)
            console.log(blogData)
        };
        getBlog();
    }, [pathname]);

    const updateHandleSubmit = () => {
        if (!blog.id) {
            return;
        }
        fetchApi(
            "http://localhost:3000/api/blogs?id=" + 1
        ).then(res => {
            if (res && res.blog) {
                fetchApi(
                    "http://localhost:3000/api/blogs", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        blog: {
                            id: blog.id,
                            title: blog.title,
                            description: blog.description,
                        },
                    }),
                }
                )
            }
        })
    };

    const saveHandleSubmit = () => {
        if (!saveBlog) {
            return;
        }

        fetchApi(
            "http://localhost:3000/api/blogs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                blog: {
                    timestamp: saveBlog.timestamp,
                    title: saveBlog.title,
                    description: saveBlog.description,
                },
            }),
        }
        )
    };

    const handleInputChangeBlog = (e) => {
        const { name, value } = e.target;
        setBlog((prevBlog) => ({
            ...prevBlog,
            [name]: value,
        }));
    };

    const handleInputChangeSaveBlog = (e) => {
        const { name, value } = e.target;
        setSaveBlog((prevBlog) => ({
            ...prevBlog,
            [name]: value,
        }));
    };

    return (
        <div style={{ position: "relative", backgroundColor: '#12182b', minHeight: '100vh', color: 'white' }}>
            {blog ? (
                <div style={{ maxWidth: '1000px', margin: 'auto', textAlign: 'left', paddingTop: '15px' }}>
                    {/* <h1 style={{ borderBottom: '2px solid #333', paddingBottom: '10px' }}>
                        Blog ID: {blog.id}
                    </h1> */}
                    {/* Title:  */}
                    <h1>{blog.title}</h1>
                    <div style={{ display: "flex", justifyContent: 'center', alignItems: 'center', marginTop: '35px' }}>
                        <p style={{ width: '50%' }}>
                            {/* <img style={{ width: '100%' }} src="https://img1.baidu.com/it/u=3056037228,1303504599&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500" /> */}
                        </p>
                        {/* Description: */}
                        <p style={{ width: '50%', color: '#dfe6e6', marginLeft: '20px' }}> {blog.description}</p>
                    </div>

                    {/* <form style={{ marginTop: '20px', display: 'grid', gap: '10px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', alignItems: 'center' }}>
                            <label htmlFor="title">Title:</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={blog.title}
                                onChange={handleInputChangeBlog}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', alignItems: 'center' }}>
                            <label htmlFor="description">Description:</label>
                            <input
                                type="text"
                                id="description"
                                name="description"
                                value={blog.description}
                                onChange={handleInputChangeBlog}
                            />
                        </div>

                        <button
                            type="button"
                            onClick={updateHandleSubmit}
                            style={{
                                backgroundColor: '#4CAF50',
                                color: 'white',
                                padding: '10px 15px',
                                margin: '10px 0',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                            }}
                        >
                            Submit
                        </button>
                    </form> */}
                </div>
            ) : (
                <div style={{ maxWidth: '1000px', margin: 'auto', textAlign: 'left', paddingTop: '15px' }}>
                    <form style={{ marginTop: '20px', display: 'grid', gap: '10px' }}>
                        <div style={{ textAlign: 'right' }}>
                            <button
                                type="button"
                                onClick={saveHandleSubmit}
                                style={{
                                    width: '90px',
                                    backgroundColor: '#4CAF50',
                                    color: 'white',
                                    padding: '10px 15px',
                                    margin: '10px 0',
                                    border: 'none',
                                    borderRadius: '20px',
                                    cursor: 'pointer',
                                }}
                            >
                                Publish
                            </button>
                        </div>
                        {/* <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', alignItems: 'center' }}>
                            <label htmlFor="pid">Pid:</label>
                            <input
                                type="text"
                                id="pid"
                                name="pid"
                                value={saveBlog.pid}
                                onChange={handleInputChangeSaveBlog}
                            />
                        </div> */}

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', alignItems: 'center' }}>
                            {/* <label htmlFor="title">Title:</label> */}
                            <input
                                type="text"
                                id="title"
                                name="title"
                                style={{
                                    border: 'none',
                                    outline: 'none',
                                    color: 'white',
                                    backgroundColor: 'transparent',
                                    fontSize: '28px'
                                }}
                                value={saveBlog.title}
                                placeholder="Title"
                                onChange={handleInputChangeSaveBlog}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', alignItems: 'center', marginTop: '50px' }}>
                            {/* <label htmlFor="description">Description:</label> */}
                            <input
                                type="text"
                                id="description"
                                name="description"
                                style={{
                                    border: 'none',
                                    outline: 'none',
                                    color: 'white',
                                    backgroundColor: 'transparent',
                                    fontSize: '28px'
                                }}
                                placeholder="Tell your story..."
                                value={saveBlog.description}
                                onChange={handleInputChangeSaveBlog}
                            />
                        </div>
                    </form>
                </div>
            )
            }


        </div >
    );
};

export default BlogComponent;
