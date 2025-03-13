using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Olx.DAL.Migrations
{
    /// <inheritdoc />
    public partial class Add_cascade_delete_for_entities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "tbl_AdvertFilterValues");

            migrationBuilder.CreateTable(
                name: "tbl_AdvertFilterValue",
                columns: table => new
                {
                    AdvertId = table.Column<int>(type: "integer", nullable: false),
                    FilterValueId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tbl_AdvertFilterValue", x => new { x.AdvertId, x.FilterValueId });
                    table.ForeignKey(
                        name: "FK_tbl_AdvertFilterValue_tbl_Adverts_AdvertId",
                        column: x => x.AdvertId,
                        principalTable: "tbl_Adverts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_tbl_AdvertFilterValue_tbl_FilterValues_FilterValueId",
                        column: x => x.FilterValueId,
                        principalTable: "tbl_FilterValues",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_tbl_AdvertFilterValue_FilterValueId",
                table: "tbl_AdvertFilterValue",
                column: "FilterValueId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "tbl_AdvertFilterValue");

            migrationBuilder.CreateTable(
                name: "tbl_AdvertFilterValues",
                columns: table => new
                {
                    AdvertsId = table.Column<int>(type: "integer", nullable: false),
                    FilterValuesId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tbl_AdvertFilterValues", x => new { x.AdvertsId, x.FilterValuesId });
                    table.ForeignKey(
                        name: "FK_tbl_AdvertFilterValues_tbl_Adverts_AdvertsId",
                        column: x => x.AdvertsId,
                        principalTable: "tbl_Adverts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_tbl_AdvertFilterValues_tbl_FilterValues_FilterValuesId",
                        column: x => x.FilterValuesId,
                        principalTable: "tbl_FilterValues",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_tbl_AdvertFilterValues_FilterValuesId",
                table: "tbl_AdvertFilterValues",
                column: "FilterValuesId");
        }
    }
}
