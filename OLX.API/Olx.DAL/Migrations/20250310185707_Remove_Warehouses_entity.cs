using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Olx.DAL.Migrations
{
    /// <inheritdoc />
    public partial class Remove_Warehouses_entity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "tbl_Warehouses");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "tbl_Warehouses",
                columns: table => new
                {
                    Ref = table.Column<string>(type: "character varying(36)", unicode: false, maxLength: 36, nullable: false),
                    SettlementRef = table.Column<string>(type: "character varying(36)", unicode: false, maxLength: 36, nullable: false),
                    Description = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    Phone = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tbl_Warehouses", x => x.Ref);
                    table.ForeignKey(
                        name: "FK_tbl_Warehouses_tbl_Settlements_SettlementRef",
                        column: x => x.SettlementRef,
                        principalTable: "tbl_Settlements",
                        principalColumn: "Ref",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_tbl_Warehouses_SettlementRef",
                table: "tbl_Warehouses",
                column: "SettlementRef");
        }
    }
}
