# duncan-blog

Most likely won't run on Windows (because of dependencies)

## Requirements

1. Postgres server
2. FFmpeg
3. libvips compiled with support for libheif (which includes libde265 and x265)

## Installing libvips

The libvips included with sharp doesn't include HEIF support, so we'll need to provide one ourselves.

### macOS

On macOS, the vips package includes libheif:

```bash
brew install vips
```

### Linux

On Linux, you'll need to compile libvips from source.
[https://github.com/libvips/libvips/wiki/Build-for-Ubuntu](https://github.com/libvips/libvips/wiki/Build-for-Ubuntu)

Install libheif on Ubuntu:

```bash
sudo apt install libheif-dev
```

If you've already installed the dependencies, you'll have to rebuild sharp:

```bash
pnpm rebuild sharp
```

## Example .env

```
DATABASE_URL="postgres://user:password@host:port/database"

UPLOADS_URL="https://uploads.example.com"
UPLOADS_PATH="/mnt/volume/uploads"

REBUILD_PATH="/Users/duncan/MEGA/Projects/duncan-blog"

NEXT_PUBLIC_BLOG_NAME="example.com"
NEXT_PUBLIC_BLOG_FULLNAME="Duncan's Blog"
```
