-- CreateTable
CREATE TABLE "Settings" (
    "key" TEXT NOT NULL,
    "value" JSON NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("key")
);

INSERT INTO
  "Settings" ("key", "value")
VALUES
  (
    'headerLinks',
    (
      coalesce(
        (
          SELECT
            json_agg(
              json_build_object('name', name, 'url', url, 'icon', icon)
            )
          FROM
            "HeaderLink"
        ),
        '[]'::json
      )
    )
  );

DROP TABLE "HeaderLink";