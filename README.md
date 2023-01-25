# duncan-blog

## Requirements

1. Postgres server
2. FFmpeg
3. Optional: libvips compiled with support for libheif (which includes libde265 and x265)

## Docker

Docker image is available at [https://hub.docker.com/r/duncannah/duncan-blog](https://hub.docker.com/r/duncannah/duncan-blog)

The CMS is exposed on port 4201. The volumes are:

1. `/uploads` - where the uploaded images are stored
2. `/blog` - where the static blog is built

The Docker image doesn't have HEIF support.

### Basic docker-compose.yml example

```yaml
version: "3"
services:
    blog:
        image: duncannah/duncan-blog
        ports:
            - "4201:4201"
        volumes:
            - ./uploads:/uploads
            - ./blog:/blog
        environment:
            DATABASE_URL: "postgres://user:password@host:port/database"
            UPLOADS_URL: "https://uploads.example.com"
```

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
```
