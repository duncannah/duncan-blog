# duncan-blog

A simple blog, with a simple CMS to go with it.

![Main page](docs/1.png)
![CMS](docs/2.png)

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

A developement Docker Compose config is available in the [docker-compose.yml](docker-compose.yml) file. If you're using in in production, change the `build:` to `image` and set the appropriate environment variables.

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

```bash
# Postgres connection string
DATABASE_URL="postgres://user:password@host:port/database"

# URL where the uploads are served from
UPLOADS_URL="https://uploads.example.com"

# Path to the uploads directory
UPLOADS_PATH="/mnt/volume/uploads"

# Path to the blog repo
REBUILD_PATH="/home/user/duncan-blog"

# Optional, specifies where the blog static files are built
EXPORT_PATH="/mnt/volume/blog"
```
