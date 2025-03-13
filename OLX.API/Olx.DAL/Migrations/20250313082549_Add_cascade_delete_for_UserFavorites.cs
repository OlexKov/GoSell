using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Olx.DAL.Migrations
{
    /// <inheritdoc />
    public partial class Add_cascade_delete_for_UserFavorites : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_tbl_UserFavorites_AspNetUsers_FavoritedByUsersId",
                table: "tbl_UserFavorites");

            migrationBuilder.DropForeignKey(
                name: "FK_tbl_UserFavorites_tbl_Adverts_FavoriteAdvertsId",
                table: "tbl_UserFavorites");

            migrationBuilder.RenameColumn(
                name: "FavoritedByUsersId",
                table: "tbl_UserFavorites",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "FavoriteAdvertsId",
                table: "tbl_UserFavorites",
                newName: "AdvertId");

            migrationBuilder.RenameIndex(
                name: "IX_tbl_UserFavorites_FavoritedByUsersId",
                table: "tbl_UserFavorites",
                newName: "IX_tbl_UserFavorites_UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_tbl_UserFavorites_AspNetUsers_UserId",
                table: "tbl_UserFavorites",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_tbl_UserFavorites_tbl_Adverts_AdvertId",
                table: "tbl_UserFavorites",
                column: "AdvertId",
                principalTable: "tbl_Adverts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_tbl_UserFavorites_AspNetUsers_UserId",
                table: "tbl_UserFavorites");

            migrationBuilder.DropForeignKey(
                name: "FK_tbl_UserFavorites_tbl_Adverts_AdvertId",
                table: "tbl_UserFavorites");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "tbl_UserFavorites",
                newName: "FavoritedByUsersId");

            migrationBuilder.RenameColumn(
                name: "AdvertId",
                table: "tbl_UserFavorites",
                newName: "FavoriteAdvertsId");

            migrationBuilder.RenameIndex(
                name: "IX_tbl_UserFavorites_UserId",
                table: "tbl_UserFavorites",
                newName: "IX_tbl_UserFavorites_FavoritedByUsersId");

            migrationBuilder.AddForeignKey(
                name: "FK_tbl_UserFavorites_AspNetUsers_FavoritedByUsersId",
                table: "tbl_UserFavorites",
                column: "FavoritedByUsersId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_tbl_UserFavorites_tbl_Adverts_FavoriteAdvertsId",
                table: "tbl_UserFavorites",
                column: "FavoriteAdvertsId",
                principalTable: "tbl_Adverts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
